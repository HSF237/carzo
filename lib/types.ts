export type Category = "diecast" | "rc";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // INR
  mrp: number; // original price for discount display
  image: string;
  description: string;
  scale?: string; // e.g. "1:64"
  brandLine?: string; // e.g. "Speed Series"
  stock: number;
  featured?: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: "cod" | "online";
  status: "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  message: string;
  read: boolean;
  createdAt: string;
}
