import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const { query } = req.body;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Search Shopify products for: ${query}`,
    });

    res.status(200).json({ result: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
