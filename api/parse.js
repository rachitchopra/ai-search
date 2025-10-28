import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
    You are an assistant that extracts structured filters from e-commerce search phrases.
    Respond only in JSON with:
    {
      "keyword": "main product type",
      "color": "color if mentioned",
      "price_lt": number (max price if mentioned, else null),
      "price_gt": number (min price if mentioned, else null),
      "sort": "relevance | price_asc | price_desc | newest"
    }

    Phrase: "${query}"
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    let text = completion.choices[0]?.message?.content?.trim() || "{}";
    if (text.startsWith("```")) text = text.replace(/```(json)?/g, "").trim();

    const filters = JSON.parse(text);
    res.status(200).json({ filters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI parsing failed" });
  }
}
