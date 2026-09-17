import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  handleSynthesizeRequest,
  handleGetSampleRequest,
  handleGetTonesRequest
} from './src/server/voiceService.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    cloudTtsKeyConfigured: Boolean(process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_CLOUD_API_KEY)
  });
});

// API: List tones & confirm male-only voice mappings
app.get('/api/tones', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const result = handleGetTonesRequest();
  res.status(result.status).json(result.body);
});

// API: Synthesize Hindi speech
app.post('/api/synthesize', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const result = await handleSynthesizeRequest(req.body || {});
    return res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('Server error in /api/synthesize:', err);
    return res.status(500).json({
      success: false,
      error: `Voice generation failed: ${err?.message || 'Internal server error'}`
    });
  }
});

// API: Pre-rendered / verified real male test sample
app.get('/api/test-sample', async (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const result = await handleGetSampleRequest();
    return res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('Error serving test sample:', err);
    return res.status(500).json({
      success: false,
      error: `Voice generation failed: ${err?.message || 'Could not load test sample'}`
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
