import fs from "fs";
import path from "path";
import { Product, Order } from "./types";
import { seedProducts } from "./seed";

/**
 * Simple JSON-file data layer.
 * Swap this file for a Postgres/Prisma implementation before production
 * deploy on Vercel (serverless filesystem is ephemeral).
 */

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PRODUCTS_FILE))
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seedProducts, null, 2));
  if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]");
}

function readJSON<T>(file: string): T {
  ensure();
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

function writeJSON(file: string, data: unknown) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---------- Products ----------
export function getProducts(): Product[] {
  return readJSON<Product[]>(PRODUCTS_FILE);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function addProduct(p: Omit<Product, "id" | "createdAt">): Product {
  const products = getProducts();
  const product: Product = {
    ...p,
    id: "p" + Date.now().toString(36),
    createdAt: new Date().toISOString(),
  };
  products.unshift(product);
  writeJSON(PRODUCTS_FILE, products);
  return product;
}

export function updateProduct(id: string, patch: Partial<Product>): Product | undefined {
  const products = getProducts();
  const i = products.findIndex((p) => p.id === id);
  if (i === -1) return undefined;
  products[i] = { ...products[i], ...patch, id: products[i].id };
  writeJSON(PRODUCTS_FILE, products);
  return products[i];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  writeJSON(PRODUCTS_FILE, next);
  return true;
}

// ---------- Orders ----------
export function getOrders(): Order[] {
  return readJSON<Order[]>(ORDERS_FILE);
}

export function addOrder(o: Omit<Order, "id" | "createdAt" | "status">): Order {
  const orders = getOrders();
  const order: Order = {
    ...o,
    id: "CZ" + Date.now().toString(36).toUpperCase(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  writeJSON(ORDERS_FILE, orders);
  return order;
}

export function updateOrderStatus(id: string, status: Order["status"]): Order | undefined {
  const orders = getOrders();
  const i = orders.findIndex((x) => x.id === id);
  if (i === -1) return undefined;
  orders[i].status = status;
  writeJSON(ORDERS_FILE, orders);
  return orders[i];
}
