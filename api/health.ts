import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    cloudTtsKeyConfigured: Boolean(process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_CLOUD_API_KEY)
  });
}
