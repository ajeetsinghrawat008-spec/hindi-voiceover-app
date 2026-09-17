import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSynthesizeRequest } from '../src/server/voiceService.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always guarantee JSON response headers and CORS for Vercel deployments
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed. Please use POST to synthesize speech.`
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON payload received in request body.'
        });
      }
    }

    const result = await handleSynthesizeRequest(body || {});
    return res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('[API /synthesize] Serverless handler error:', err);
    return res.status(500).json({
      success: false,
      error: `Internal serverless error in /api/synthesize: ${err?.message || 'Unknown error'}`
    });
  }
}
