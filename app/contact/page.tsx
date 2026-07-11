import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact — Carzo" };

export default function Contact() {
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 98765 43210";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@carzo.in";
  const contactHours = process.env.NEXT_PUBLIC_CONTACT_HOURS || "Mon–Sat, 10:00 AM – 7:00 PM IST";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="display text-5xl text-white">
          Talk to the <span className="text-red-hot">pit crew</span>
        </h1>
        <p className="mt-3 text-muted">
          Questions about an order, a product, or bulk buying? We reply fast.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-hot">WhatsApp / Phone</p>
              <p className="mt-1 text-lg font-semibold text-white">{contactPhone}</p>
            </div>
            <div className="rounded-xl border border-line bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-hot">Email</p>
              <p className="mt-1 text-lg font-semibold text-white">{contactEmail}</p>
            </div>
            <div className="rounded-xl border border-line bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-hot">Hours</p>
              <p className="mt-1 text-white">{contactHours}</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
