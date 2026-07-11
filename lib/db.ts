import { db } from "./firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch
} from "firebase/firestore";
import { Product, Order, OrderItem } from "./types";
import { seedProducts } from "./seed";

/**
 * Production-ready Firebase Firestore database data layer.
 * Replaces the SQL database implementation and supports auto-seeding.
 */

// Run seeding once when the module loads — doesn't block queries
let seedingDone = false;
let seedingPromise: Promise<void> | null = null;

async function seedIfNeeded() {
  if (seedingDone) return;
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    if (productsSnapshot.empty) {
      console.log("🌱 Seeding Firestore products database...");
      const batch = writeBatch(db);
      for (const p of seedProducts) {
        const docRef = doc(db, "products", p.id);
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
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
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
  const q = query(collection(db, "products"), where("slug", "==", slug));
  const snap = await getDocs(q);
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
  const docRef = doc(db, "products", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return undefined;

  const data = snap.data();
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
  const product: Product = { ...p, id, createdAt };
  await setDoc(doc(db, "products", id), { ...product, featured: !!p.featured });
  invalidateProductsCache();
  return product;
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | undefined> {
  await ensure();
  const current = await getProductById(id);
  if (!current) return undefined;
  const updated = { ...current, ...patch };
  await setDoc(doc(db, "products", id), { ...updated, featured: !!updated.featured });
  invalidateProductsCache();
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensure();
  invalidateProductsCache();
  const docRef = doc(db, "products", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return false;
  await deleteDoc(docRef);
  return true;
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  await ensure();
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
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

  const batch = writeBatch(db);

  const orderRef = doc(db, "orders", id);
  batch.set(orderRef, {
    ...order,
    paymentId: o.paymentId || null
  });

  for (const item of o.items) {
    const productRef = doc(db, "products", item.productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      const currentStock = Number(productSnap.data().stock || 0);
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
  const orderRef = doc(db, "orders", id);
  const orderSnap = await getDoc(orderRef);
  if (!orderSnap.exists()) return undefined;

  await updateDoc(orderRef, { status });

  const data = orderSnap.data();
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
