#!/bin/bash

# Termux Automated Setup Script for CMYK Admin Engine (Cloudflare Edge)
set -e

PROJECT_NAME="cmyk-admin-engine"

echo "🚀 Initializing Edge Application Architecture: $PROJECT_NAME..."

# 1. Generate Directory Tree
mkdir -p $PROJECT_NAME/{src/{db,routes,middleware,utils},migrations,public}
cd $PROJECT_NAME

# 2. Generate package.json
cat << 'JSON' > package.json
{
  "name": "cmyk-admin-engine",
  "version": "1.0.0",
  "description": "CMYK Brand Media LTD - Cloudflare Edge Admin API & CRM",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "d1:migrate": "wrangler d1 migrations apply cmyk-production-db --local",
    "d1:migrate:prod": "wrangler d1 migrations apply cmyk-production-db --remote"
  },
  "dependencies": {
    "drizzle-orm": "^0.30.0",
    "hono": "^4.0.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0",
    "wrangler": "^3.30.0"
  }
}
JSON

# 3. Generate Cloudflare Wrangler Configuration
cat << 'TOML' > wrangler.toml
name = "cmyk-admin-engine"
main = "src/index.js"
compatibility_date = "2026-01-01"

# Cloudflare D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "cmyk-production-db"
database_id = "REPLACE_WITH_YOUR_D1_DATABASE_ID"

# Cloudflare R2 Bucket Binding for Artwork Uploads
[[r2_buckets]]
binding = "ARTWORK_BUCKET"
bucket_name = "cmyk-artworks"

[site]
bucket = "./public"
TOML

# 4. Generate Database Schema (Drizzle ORM for SQLite/D1)
cat << 'JS' > src/db/schema.js
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: text('role').default('operator').notNull(), // 'master_admin' | 'operator'
    createdAt: text('created_at').notNull()
});

export const customLeads = sqliteTable('custom_leads', {
    leadId: text('lead_id').primaryKey(),
    clientName: text('client_name').notNull(),
    clientPhone: text('client_phone').notNull(),
    clientEmail: text('client_email'),
    serviceType: text('service_type').notNull(), // 'DTF_PRINT', 'UV_PRINT', 'CUSTOM_APPAREL'
    printSpecs: text('print_specs').notNull(), // JSON string
    status: text('status').default('PENDING').notNull(),
    createdAt: text('created_at').notNull()
});

export const auditLogs = sqliteTable('audit_logs', {
    logId: text('log_id').primaryKey(),
    operatorId: text('operator_id').notNull(),
    action: text('action').notNull(),
    targetResource: text('target_resource').notNull(),
    timestamp: text('timestamp').notNull()
});
JS

# 5. Generate Cryptographic Hashing Utility (SHA-256 for Web Crypto API)
cat << 'JS' > src/utils/crypto.js
/**
 * Hashes passwords using native Web Crypto API (V8 Edge / Cloudflare Compatible)
 */
export async function hashSHA256(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
JS

# 6. Generate Master Worker Entrypoint using Hono Framework
cat << 'JS' > src/index.js
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { customLeads } from './db/schema.js';

const app = new Hono();

// Enable CORS for Storefront and Admin Frontend
app.use('*', cors());

// Health Check
app.get('/api/health', (c) => c.json({ status: 'active', environment: 'Cloudflare Edge' }));

// Lead Ingestion Route (Custom Lab Storefront Endpoint)
app.post('/api/leads/custom-order', async (c) => {
    try {
        const body = await c.req.json();
        const { clientName, clientPhone, clientEmail, serviceType, printSpecs } = body;

        if (!clientName || !clientPhone || !serviceType) {
            return c.json({ success: false, error: 'Missing mandatory client contact details.' }, 422);
        }

        const leadId = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Direct D1 Prepared Query Execution
        await c.env.DB.prepare(`
            INSERT INTO custom_leads (lead_id, client_name, client_phone, client_email, service_type, print_specs, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?)
        `).bind(
            leadId,
            clientName,
            clientPhone,
            clientEmail || null,
            serviceType,
            JSON.stringify(printSpecs || {}),
            createdAt
        ).run();

        return c.json({
            success: true,
            message: 'Order request logged successfully in D1.',
            data: { leadId, createdAt }
        }, 201);

    } catch (err) {
        return c.json({ success: false, error: err.message }, 500);
    }
});

export default app;
JS

# 7. Generate .gitignore and README
cat << 'TXT' > .gitignore
node_modules/
.wrangler/
dist/
.env
TXT

cat << 'MD' > README.md
# CMYK Brand Media - Edge Admin Engine & API
Powered by Cloudflare Workers, D1 SQLite, R2 Storage, and Hono.
MD

echo "✅ Environment Provisioned Successfully!"
echo "📍 Navigate to project: cd $PROJECT_NAME"
echo "📦 Install dependencies: npm install"
