import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGetTonesRequest } from '../src/server/voiceService.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const result = handleGetTonesRequest();
  return res.status(result.status).json(result.body);
}
