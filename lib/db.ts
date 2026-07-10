import { Pool } from "pg";
import { Product, Order, OrderItem } from "./types";
import { seedProducts } from "./seed";

/**
 * Production-ready PostgreSQL data layer.
 * Utilizes connection pooling and handles schema auto-creation.
 */

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: !connectionString || connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false }
});

let isInitialized = false;

async function ensure() {
  if (isInitialized) return;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not defined in your environment variables! Please configure a PostgreSQL connection string in your .env.local file.\n" +
      "Example:\nDATABASE_URL=postgresql://postgres:postgres@localhost:5432/carzo"
    );
  }

  let client;
  try {
    client = await pool.connect();
  } catch (err: any) {
    console.error("❌ PostgreSQL connection failed:", err);
    throw new Error(
      `PostgreSQL connection failed! Please make sure your database server is running and the DATABASE_URL in your .env.local is correct.\n` +
      `Error details: ${err.message || err}`
    );
  }

  try {
    // 1. Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price INT NOT NULL,
        mrp INT NOT NULL,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        scale VARCHAR(50),
        brand_line VARCHAR(100),
        stock INT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(255),
        customer_address TEXT NOT NULL,
        customer_city VARCHAR(100) NOT NULL,
        customer_state VARCHAR(100) NOT NULL,
        customer_pincode VARCHAR(20) NOT NULL,
        total INT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create order_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        qty INT NOT NULL
      );
    `);

    // Check if products are seeded, if not, seed them
    const res = await client.query("SELECT COUNT(*) FROM products");
    const count = parseInt(res.rows[0].count, 10);
    if (count === 0) {
      for (const p of seedProducts) {
        await client.query(
          `INSERT INTO products (id, slug, name, category, price, mrp, image, description, scale, brand_line, stock, featured, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [p.id, p.slug, p.name, p.category, p.price, p.mrp, p.image, p.description, p.scale || null, p.brandLine || null, p.stock, !!p.featured, p.createdAt]
        );
      }
    }
    isInitialized = true;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// ---------- Products ----------
export async function getProducts(): Promise<Product[]> {
  await ensure();
  const res = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return res.rows.map(row => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as "diecast" | "rc",
    price: row.price,
    mrp: row.mrp,
    image: row.image,
    description: row.description,
    scale: row.scale || undefined,
    brandLine: row.brand_line || undefined,
    stock: row.stock,
    featured: row.featured,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await ensure();
  const res = await pool.query("SELECT * FROM products WHERE slug = $1", [slug]);
  if (res.rows.length === 0) return undefined;
  const row = res.rows[0];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as "diecast" | "rc",
    price: row.price,
    mrp: row.mrp,
    image: row.image,
    description: row.description,
    scale: row.scale || undefined,
    brandLine: row.brand_line || undefined,
    stock: row.stock,
    featured: row.featured,
    createdAt: row.created_at.toISOString(),
  };
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await ensure();
  const res = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  if (res.rows.length === 0) return undefined;
  const row = res.rows[0];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as "diecast" | "rc",
    price: row.price,
    mrp: row.mrp,
    image: row.image,
    description: row.description,
    scale: row.scale || undefined,
    brandLine: row.brand_line || undefined,
    stock: row.stock,
    featured: row.featured,
    createdAt: row.created_at.toISOString(),
  };
}

export async function addProduct(p: Omit<Product, "id" | "createdAt">): Promise<Product> {
  await ensure();
  const id = "p" + Date.now().toString(36);
  const createdAt = new Date().toISOString();
  await pool.query(
    `INSERT INTO products (id, slug, name, category, price, mrp, image, description, scale, brand_line, stock, featured, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [id, p.slug, p.name, p.category, p.price, p.mrp, p.image, p.description, p.scale || null, p.brandLine || null, p.stock, !!p.featured, createdAt]
  );
  return {
    ...p,
    id,
    createdAt
  };
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | undefined> {
  await ensure();
  const current = await getProductById(id);
  if (!current) return undefined;

  const updated = { ...current, ...patch };
  await pool.query(
    `UPDATE products 
     SET slug = $1, name = $2, category = $3, price = $4, mrp = $5, image = $6, description = $7, scale = $8, brand_line = $9, stock = $10, featured = $11
     WHERE id = $12`,
    [
      updated.slug,
      updated.name,
      updated.category,
      updated.price,
      updated.mrp,
      updated.image,
      updated.description,
      updated.scale || null,
      updated.brandLine || null,
      updated.stock,
      !!updated.featured,
      id
    ]
  );
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensure();
  const res = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  await ensure();
  const ordersRes = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  const orders: Order[] = [];

  for (const row of ordersRes.rows) {
    const itemsRes = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [row.id]);
    const items: OrderItem[] = itemsRes.rows.map(itemRow => ({
      productId: itemRow.product_id,
      name: itemRow.name,
      price: itemRow.price,
      qty: itemRow.qty
    }));

    orders.push({
      id: row.id,
      customer: {
        name: row.customer_name,
        phone: row.customer_phone,
        email: row.customer_email || undefined,
        address: row.customer_address,
        city: row.customer_city,
        state: row.customer_state,
        pincode: row.customer_pincode
      },
      items,
      total: row.total,
      paymentMethod: row.payment_method as any,
      status: row.status as Order["status"],
      createdAt: row.created_at.toISOString()
    });
  }

  return orders;
}

export async function addOrder(o: Omit<Order, "id" | "createdAt" | "status"> & { paymentId?: string }): Promise<Order> {
  await ensure();
  const id = "CZ" + Date.now().toString(36).toUpperCase();
  const status = "new";
  const createdAt = new Date().toISOString();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    await client.query(
      `INSERT INTO orders (id, customer_name, customer_phone, customer_email, customer_address, customer_city, customer_state, customer_pincode, total, payment_method, payment_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id,
        o.customer.name,
        o.customer.phone,
        o.customer.email || null,
        o.customer.address,
        o.customer.city,
        o.customer.state,
        o.customer.pincode,
        o.total,
        o.paymentMethod,
        o.paymentId || null,
        status,
        createdAt
      ]
    );

    for (const item of o.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, qty)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, item.productId, item.name, item.price, item.qty]
      );
      
      await client.query(
        `UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
        [item.qty, item.productId]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  return {
    ...o,
    id,
    status,
    createdAt
  };
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
  await ensure();
  
  const res = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );

  if (res.rows.length === 0) return undefined;
  
  const row = res.rows[0];
  const itemsRes = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [id]);
  const items: OrderItem[] = itemsRes.rows.map(itemRow => ({
    productId: itemRow.product_id,
    name: itemRow.name,
    price: itemRow.price,
    qty: itemRow.qty
  }));

  return {
    id: row.id,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email || undefined,
      address: row.customer_address,
      city: row.customer_city,
      state: row.customer_state,
      pincode: row.customer_pincode
    },
    items,
    total: row.total,
    paymentMethod: row.payment_method as any,
    status: row.status as Order["status"],
    createdAt: row.created_at.toISOString()
  };
}
