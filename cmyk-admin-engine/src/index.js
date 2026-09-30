import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, jwt } from 'hono/jwt';

const app = new Hono();
const JWT_SECRET = 'cmyk_production_secret_2026';

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => c.json({ status: 'online', service: 'CMYK Admin Engine' }, 200));

app.post('/api/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json();
    if (username === 'admin' && password === 'admin123') {
      const payload = {
        username: 'admin',
        role: 'superadmin',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      };
      const token = await sign(payload, JWT_SECRET, 'HS256');
      return c.json({ success: true, token }, 200);
    }
    return c.json({ success: false, error: 'Invalid credentials' }, 401);
  } catch (err) {
    return c.json({ success: false, error: 'Invalid payload' }, 400);
  }
});

app.get('/api/admin/dashboard', jwt({ secret: JWT_SECRET, alg: 'HS256' }), (c) => {
  const user = c.get('jwtPayload');
  return c.json({
    success: true,
    data: { user: user.username, activeOrders: 14, pendingPrints: 3, revenueToday: 125000 }
  });
});

export default { port: 3000, fetch: app.fetch };