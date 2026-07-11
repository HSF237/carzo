import { adminDb } from "./firebase-admin";
import { Product, Order, OrderItem } from "./types";
import { seedProducts } from "./seed";
import { normalizeImageUrl } from "./image";

/**
 * Production-ready Firebase Firestore database data layer.
 * Uses the Firebase Admin SDK — reliable in serverless environments,
 * unlike the client SDK's browser-oriented streaming transport.
 */

// Run seeding once when the module loads — doesn't block queries
let seedingDone = false;
let seedingPromise: Promise<void> | null = null;

async function seedIfNeeded() {
  if (seedingDone) return;
  try {
    const productsSnapshot = await adminDb.collection("products").get();
    if (productsSnapshot.empty) {
      console.log("🌱 Seeding Firestore products database...");
      const batch = adminDb.batch();
      for (const p of seedProducts) {
        const docRef = adminDb.collection("products").doc(p.id);
        batch.set(docRef, { ...p, featured: !!p.featured });
      }
      await batch.commit();
      console.log("✅ Seeding complete!");
    }
    seedingDone = true;
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
}

async function ensure() {
  if (seedingDone) return;
  if (!seedingPromise) seedingPromise = seedIfNeeded();
  await seedingPromise;
}

// ---------- Products ----------
// Raw fetcher
async function _getProducts(): Promise<Product[]> {
  await ensure();
  try {
    const snap = await adminDb.collection("products").orderBy("createdAt", "desc").get();
    const products: Product[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        mrp: Number(data.mrp),
        image: data.image,
        description: data.description,
        scale: data.scale || undefined,
        brandLine: data.brandLine || undefined,
        stock: Number(data.stock),
        featured: Boolean(data.featured),
        createdAt: data.createdAt,
      });
    });
    return products;
  } catch (err) {
    console.error("Firestore getProducts failed:", err);
    return [];
  }
}

// ── In-memory TTL cache (survives across warm invocations) ──────────────────
let productsCache: { data: Product[]; ts: number } | null = null;
const CACHE_TTL_MS = 60_000; // 60 seconds

export async function getProducts(): Promise<Product[]> {
  // Return cached data if still fresh
  if (productsCache && Date.now() - productsCache.ts < CACHE_TTL_MS) {
    return productsCache.data;
  }
  const data = await _getProducts();
  productsCache = { data, ts: Date.now() };
  return data;
}

/** Call this after any write so the next read hits Firestore fresh */
export function invalidateProductsCache() {
  productsCache = null;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await ensure();
  const snap = await adminDb.collection("products").where("slug", "==", slug).get();
  if (snap.empty) return undefined;

  const doc = snap.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    mrp: Number(data.mrp),
    image: data.image,
    description: data.description,
    scale: data.scale || undefined,
    brandLine: data.brandLine || undefined,
    stock: Number(data.stock),
    featured: Boolean(data.featured),
    createdAt: data.createdAt,
  };
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await ensure();
  const snap = await adminDb.collection("products").doc(id).get();
  if (!snap.exists) return undefined;

  const data = snap.data()!;
  return {
    id: snap.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    price: Number(data.price),
    mrp: Number(data.mrp),
    image: data.image,
    description: data.description,
    scale: data.scale || undefined,
    brandLine: data.brandLine || undefined,
    stock: Number(data.stock),
    featured: Boolean(data.featured),
    createdAt: data.createdAt,
  };
}

export async function addProduct(p: Omit<Product, "id" | "createdAt">): Promise<Product> {
  await ensure();
  const id = "p" + Date.now().toString(36);
  const createdAt = new Date().toISOString();
  const product: Product = { ...p, id, createdAt, image: normalizeImageUrl(p.image) };
  await adminDb.collection("products").doc(id).set({ ...product, featured: !!p.featured });
  invalidateProductsCache();
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | undefined> {
  await ensure();
  const current = await getProductById(id);
  if (!current) return undefined;
  if (patch.image) patch.image = normalizeImageUrl(patch.image);
  const updated = { ...current, ...patch };
  await adminDb.collection("products").doc(id).set({ ...updated, featured: !!updated.featured });
  invalidateProductsCache();
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensure();
  invalidateProductsCache();
  const docRef = adminDb.collection("products").doc(id);
  const snap = await docRef.get();
  if (!snap.exists) return false;
  await docRef.delete();
  return true;
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  await ensure();
  try {
    const snap = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
    const orders: Order[] = [];
    snap.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        customer: data.customer,
        items: data.items,
        total: Number(data.total),
        paymentMethod: data.paymentMethod,
        status: data.status,
        createdAt: data.createdAt
      });
    });
    return orders;
  } catch (err) {
    console.error("Firestore getOrders failed, falling back to empty list:", err);
    return [];
  }
}

export async function addOrder(o: Omit<Order, "id" | "createdAt" | "status"> & { paymentId?: string }): Promise<Order> {
  await ensure();
  const id = "CZ" + Date.now().toString(36).toUpperCase();
  const status = "new";
  const createdAt = new Date().toISOString();

  const order: Order = {
    ...o,
    id,
    status,
    createdAt
  };

  const batch = adminDb.batch();

  const orderRef = adminDb.collection("orders").doc(id);
  batch.set(orderRef, {
    ...order,
    paymentId: o.paymentId || null
  });

  for (const item of o.items) {
    const productRef = adminDb.collection("products").doc(item.productId);
    const productSnap = await productRef.get();
    if (productSnap.exists) {
      const currentStock = Number(productSnap.data()?.stock || 0);
      batch.update(productRef, {
        stock: Math.max(0, currentStock - item.qty)
      });
    }
  }

  await batch.commit();
  return order;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
  await ensure();
  const orderRef = adminDb.collection("orders").doc(id);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) return undefined;

  await orderRef.update({ status });

  const data = orderSnap.data()!;
  return {
    id,
    customer: data.customer,
    items: data.items,
    total: Number(data.total),
    paymentMethod: data.paymentMethod,
    status: status,
    createdAt: data.createdAt
  };
}
