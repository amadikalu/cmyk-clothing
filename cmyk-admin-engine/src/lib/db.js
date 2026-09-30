import { DatabaseSync } from 'node:sqlite';

export const getDB = (env) => {
    // CLOUDFLARE D1 EDGE PROVIDER
    if (env && env.DB) {
        return {
            async insertOrder(id, name, phone, service) {
                await env.DB.prepare(
                    "INSERT INTO custom_orders (id, client_name, client_phone, service_type) VALUES (?, ?, ?, ?)"
                ).bind(id, name, phone, service).run();
                return { success: true, provider: 'cloudflare_d1' };
            },
            async getOrders() {
                const { results } = await env.DB.prepare(
                    "SELECT * FROM custom_orders ORDER BY created_at DESC"
                ).all();
                return results;
            },
            async updateOrderStatus(id, status) {
                const info = await env.DB.prepare(
                    "UPDATE custom_orders SET status = ? WHERE id = ?"
                ).bind(status, id).run();
                return info.meta.changes > 0;
            }
        };
    }

    // TERMUX LOCAL SQLITE PROVIDER
    const localDb = new DatabaseSync('./db/local_orders.sqlite');
    localDb.exec(`
        CREATE TABLE IF NOT EXISTS custom_orders (
            id TEXT PRIMARY KEY,
            client_name TEXT NOT NULL,
            client_phone TEXT NOT NULL,
            service_type TEXT NOT NULL,
            status TEXT DEFAULT 'pending_review',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return {
        async insertOrder(id, name, phone, service) {
            const stmt = localDb.prepare(
                "INSERT INTO custom_orders (id, client_name, client_phone, service_type) VALUES (?, ?, ?, ?)"
            );
            stmt.run(id, name, phone, service);
            return { success: true, provider: 'node_sqlite' };
        },
        async getOrders() {
            const stmt = localDb.prepare("SELECT * FROM custom_orders ORDER BY created_at DESC");
            return stmt.all(); 
        },
        async updateOrderStatus(id, status) {
            const stmt = localDb.prepare("UPDATE custom_orders SET status = ? WHERE id = ?");
            const info = stmt.run(status, id);
            return info.changes > 0; // Returns true if a row was actually updated
        }
    };
};
