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
