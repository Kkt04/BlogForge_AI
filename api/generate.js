const Groq = require('groq-sdk').default;

const groq = new Groq({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async function handler(req, res) {
  console.log('API called, method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, tone, wordCount, keywords } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const prompt = `Write a ${tone} blog post about "${topic}".
Target length: ${wordCount} words.
${keywords ? `Include these keywords naturally: ${keywords}.` : ''}

Format the response as JSON with this structure:
{
  "title": "Blog title here",
  "sections": [
    { "heading": "Section heading", "content": "Paragraph text here" }
  ]
}
Return only valid JSON, no extra text.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const raw = chatCompletion.choices[0].message.content;
    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
};