import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getDB } from '../lib/db.js';

const leadsRouter = new Hono();

// 1. Define the impenetrable schema
const orderSchema = z.object({
    client_name: z.string().min(2, "Name must be at least 2 characters."),
    client_phone: z.string().min(10, "A valid phone number is required."),
    service_type: z.enum(['DTF Print', 'Vinyl Plot', 'Embroidery', 'Screen Print'], {
        errorMap: () => ({ message: "Invalid service type requested." })
    })
});

// 2. The Route: Validation happens automatically via zValidator
leadsRouter.post('/custom-order', zValidator('json', orderSchema), async (c) => {
    // getDB automatically determines if it should use Termux SQLite or Cloudflare D1
    const db = getDB(c.env);
    
    // c.req.valid('json') only returns data if it passes the Zod schema perfectly
    const { client_name, client_phone, service_type } = c.req.valid('json');
    
    // Generate a cryptographic v4 UUID
    const id = crypto.randomUUID(); 

    try {
        const result = await db.insertOrder(id, client_name, client_phone, service_type);
        
        return c.json({
            success: true,
            order_id: id,
            provider: result.provider,
            message: "Order successfully queued for review."
        }, 201); // 201 Created
        
    } catch (error) {
        console.error("Database Transaction Failed:", error);
        return c.json({ 
            success: false, 
            error: "Failed to persist order to database." 
        }, 500);
    }
});

export default leadsRouter;
