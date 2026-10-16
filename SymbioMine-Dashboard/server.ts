import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { executeAgentQuery } from './server/agentEngine';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for AI Safety Assistant
app.post('/api/ai/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
    const result = await executeAgentQuery(query);
    res.json(result);
  } catch (error: any) {
    console.error('Agent execution error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Production static file serving
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('SymbioMine Dashboard Server running on http://localhost:' + PORT);
  });
}

export default app;
