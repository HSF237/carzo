import { Order } from "./types";

/**
 * Sends a WhatsApp alert to the store owner via Meta's WhatsApp Cloud API
 * when a new order comes in. Requires an approved "order_notification"
 * message template (business-initiated messages need one outside the
 * 24-hour customer service window).
 */
export async function sendOrderWhatsAppAlert(order: Order) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_NOTIFY_NUMBER;

  if (!token || !phoneNumberId || !to) {
    console.log("⚠️ WhatsApp not configured. Skipping WhatsApp order alert.");
    return;
  }

  const paymentStatus =
    order.paymentMethod === "online"
      ? `Paid via UPI (UTR: ${order.paymentId || "not provided"})`
      : "Cash on Delivery — not yet paid";

  const address = `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`;

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: "order_notification",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: order.id },
              { type: "text", text: order.customer.name },
              { type: "text", text: order.customer.phone },
              { type: "text", text: address },
              { type: "text", text: `Rs.${order.total}` },
              { type: "text", text: paymentStatus },
            ],
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("WhatsApp alert failed:", err);
  }
}
