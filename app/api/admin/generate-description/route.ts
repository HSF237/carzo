import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

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

  if (!process.env.ANTHROPIC_API_KEY) {
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
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 300,
      output_config: { effort: "low" },
      messages: [
        {
          role: "user",
          content: `Write a punchy, exciting 2-3 sentence e-commerce product description for a die-cast/RC car store called Carzo. No markdown, no surrounding quotes, no headings. Product details:\n${details}`,
        },
      ],
    });

    const text = msg.content.find((b) => b.type === "text")?.text?.trim() ?? "";
    if (!text) {
      return NextResponse.json({ error: "AI returned an empty description." }, { status: 500 });
    }
    return NextResponse.json({ description: text });
  } catch (err: any) {
    console.error("generate-description error:", err);
    return NextResponse.json({ error: "Failed to generate description." }, { status: 500 });
  }
}
