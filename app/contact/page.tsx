import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Contact — Carzo" };

export default function Contact() {
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
            {/* TODO: replace with client's real contact details */}
            <div className="rounded-xl border border-line bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-hot">WhatsApp / Phone</p>
              <p className="mt-1 text-lg font-semibold text-white">+91 XXXXX XXXXX</p>
            </div>
            <div className="rounded-xl border border-line bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-hot">Email</p>
              <p className="mt-1 text-lg font-semibold text-white">hello@carzo.in</p>
            </div>
            <div className="rounded-xl border border-line bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-red-hot">Hours</p>
              <p className="mt-1 text-white">Mon–Sat, 10:00 AM – 7:00 PM IST</p>
            </div>
          </div>

          <form
            className="space-y-4 rounded-xl border border-line bg-card p-6"
            action="mailto:hello@carzo.in"
            method="post"
            encType="text/plain"
          >
            <div>
              <label className="text-sm text-muted">Your name</label>
              <input
                name="name"
                required
                className="mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted">Phone or email</label>
              <input
                name="contact"
                required
                className="mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-muted">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                className="mt-1 w-full rounded-md border border-line bg-bg-soft px-3 py-2 text-white focus:border-red-brand focus:outline-none"
              />
            </div>
            <button className="skew-chip btn-red w-full rounded-sm px-6 py-3 font-bold text-white">
              <span>Send Message 🏁</span>
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
