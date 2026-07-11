import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

const GEMINI_MODEL = "gemini-3.5-flash";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, category, price, scale, brandLine } = await req.json();

  if (!name || !category) {
    return NextResponse.json(
      { error: "Fill in the product name and category first." },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI description generation isn't configured yet." },
      { status: 500 }
    );
  }

  const details = [
    `Name: ${name}`,
    `Category: ${category === "rc" ? "RC Car" : "Diecast scale model"}`,
    price ? `Price: ₹${price}` : null,
    scale ? `Scale: ${scale}` : null,
    brandLine ? `Series: ${brandLine}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a punchy, exciting 2-3 sentence e-commerce product description for a die-cast/RC car store called Carzo. No markdown, no surrounding quotes, no headings. Product details:\n${details}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Gemini API error:", res.status, errBody);
      return NextResponse.json({ error: "Failed to generate description." }, { status: 500 });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    if (!text) {
      return NextResponse.json({ error: "AI returned an empty description." }, { status: 500 });
    }
    return NextResponse.json({ description: text });
  } catch (err: any) {
    console.error("generate-description error:", err);
    return NextResponse.json({ error: "Failed to generate description." }, { status: 500 });
  }
}
