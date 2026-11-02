const GroqPackage = require('groq-sdk');
const Groq = GroqPackage.default || GroqPackage;

let groqClient = null;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      'GROQ_API_KEY environment variable is missing or empty. Please add GROQ_API_KEY to your Vercel project environment variables.'
    );
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: apiKey.trim() });
  }
  return groqClient;
}

const PRIMARY_MODEL = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { topic, tone = 'Professional', wordCount = '~600 words', keywords } = req.body || {};

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'Blog topic is required.' });
  }

  let groq;
  try {
    groq = getGroqClient();
  } catch (err) {
    console.error('Groq configuration error:', err.message);
    return res.status(500).json({ error: err.message });
  }

  const systemPrompt = `You are an expert blog post writer and content strategist.
Your task is to generate high-quality, engaging, and well-structured blog articles.
You MUST ALWAYS respond with a strictly valid JSON object matching this schema:
{
  "title": "Compelling and engaging blog post title",
  "sections": [
    {
      "heading": "Section Heading",
      "content": "Comprehensive paragraph(s) of content for this section."
    }
  ]
}
Do not include any Markdown code blocks, backticks, or text before or after the JSON. Return only the JSON object.`;

  const userPrompt = `Write a ${tone} blog post about the following topic:
Topic: "${topic.trim()}"
Target Length: Approximately ${wordCount}
${keywords && keywords.trim() ? `Keywords to naturally integrate: ${keywords.trim()}` : ''}

Requirements:
- Create an engaging, click-worthy title.
- Organize the post into at least 3 to 5 detailed sections (e.g. Introduction, Key Insights/Strategies, Real-World Application, Future Outlook, Conclusion).
- Match the "${tone}" tone throughout the entire article.
- Provide substantial, informative content for each section.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4096,
    });

    const raw = chatCompletion.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if model included them
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    }

    // Extract JSON object if any preamble or postamble exists
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('JSON parsing failed. Raw response:', raw);
      return res.status(500).json({
        error: 'Failed to parse AI response. Please try again with a slightly different prompt.',
      });
    }

    // Handle nested response structures if model wrapped it
    const normalized = parsed.blog || parsed.data || parsed.article || parsed;

    if (!normalized.title || !Array.isArray(normalized.sections) || normalized.sections.length === 0) {
      console.error('Invalid structure in parsed response:', parsed);
      return res.status(500).json({
        error: 'Generated blog post had an invalid format. Please try again.',
      });
    }

    return res.status(200).json({
      title: normalized.title,
      sections: normalized.sections.map((s, index) => ({
        heading: s.heading || s.title || `Section ${index + 1}`,
        content: s.content || s.body || s.text || '',
      })),
    });
  } catch (err) {
    console.error('Error generating blog post:', err);
    const errorMessage =
      err?.error?.message ||
      err?.message ||
      'An unexpected error occurred while generating the blog post.';
    return res.status(500).json({ error: errorMessage });
  }
};
