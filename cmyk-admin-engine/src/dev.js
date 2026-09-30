import { serve } from '@hono/node-server';
import app from './index.js';

const PORT = 3000;
const HOSTNAME = '127.0.0.1';

console.log(`🛡️  Termux Dev Engine running in isolated mode: http://${HOSTNAME}:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
  hostname: HOSTNAME
});
