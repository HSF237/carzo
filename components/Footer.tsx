import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-bg-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">
            India&apos;s playground for die-cast scale models and high-performance RC
            cars. Built for collectors, racers and kids at heart.
          </p>
        </div>
        <div>
          <h4 className="display text-sm text-white">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-white" href="/shop?cat=diecast">Scale Models</Link></li>
            <li><Link className="hover:text-white" href="/shop?cat=rc">RC Cars</Link></li>
            <li><Link className="hover:text-white" href="/shop?cat=frames">3D Car Frames</Link></li>
            <li><Link className="hover:text-white" href="/shop">All Products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="display text-sm text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link className="hover:text-white" href="/about">About Carzo</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="display text-sm text-white">Good to know</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>🚚 Shipping across India</li>
            <li>💵 Cash on Delivery available</li>
            <li>🛡️ 7-day replacement on RC cars</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Carzo. All rights reserved.
      </div>
    </footer>
  );
}
