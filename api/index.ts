import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSynthesizeRequest, handleGetSampleRequest, handleGetTonesRequest } from '../src/server/voiceService.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const cleanPath = url.split('?')[0].replace(/^\/api/, '');

  try {
    if (cleanPath === '/synthesize') {
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed. Use POST for /api/synthesize.' });
      }
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ success: false, error: 'Invalid JSON request payload.' });
        }
      }
      const result = await handleSynthesizeRequest(body || {});
      return res.status(result.status).json(result.body);
    }

    if (cleanPath === '/test-sample') {
      const result = await handleGetSampleRequest();
      return res.status(result.status).json(result.body);
    }

    if (cleanPath === '/tones') {
      const result = handleGetTonesRequest();
      return res.status(result.status).json(result.body);
    }

    if (cleanPath === '/health' || cleanPath === '' || cleanPath === '/') {
      return res.status(200).json({
        status: 'ok',
        service: 'Hindi Male Voiceover Studio API',
        geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
        cloudTtsKeyConfigured: Boolean(process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_CLOUD_API_KEY)
      });
    }

    return res.status(404).json({
      success: false,
      error: `API route '${req.url}' was not found on the voiceover server.`
    });
  } catch (err: any) {
    console.error('[API index] Handler error:', err);
    return res.status(500).json({
      success: false,
      error: `Internal server error: ${err?.message || 'Unknown error'}`
    });
  }
}
