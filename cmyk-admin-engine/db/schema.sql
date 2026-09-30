-- CMYK Clothing: Custom Orders Schema
DROP TABLE IF EXISTS custom_orders;

CREATE TABLE custom_orders (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    service_type TEXT NOT NULL, -- e.g., 'DTF Print', 'Vinyl Plot', 'Embroidery'
    status TEXT DEFAULT 'pending_review', -- 'pending_review', 'in_production', 'dispatched'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster querying by status on the Admin Dashboard
CREATE INDEX idx_orders_status ON custom_orders(status);
