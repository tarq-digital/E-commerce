-- Phase 13.5: Enterprise Customer Relationship Management (CRM) Schema

DROP TABLE IF EXISTS loyalty_program;
DROP TABLE IF EXISTS customer_segments;
DROP TABLE IF EXISTS customer_tags;
-- Do not drop tags completely as it might conflict with product tags if they share namespace.
-- Wait, product tags are in 'tags' table? Let me check 002.
-- Yes, 002_catalog_schema has 'tags'. 
-- So customer_tags uses 'tags'. Dropping 'tags' here would be bad. Just drop customer_tags.

DROP TABLE IF EXISTS customer_notes;

ALTER TABLE users 
DROP COLUMN account_status,
DROP COLUMN trust_score,
DROP COLUMN risk_level,
DROP COLUMN refund_ratio,
DROP COLUMN failed_payments,
DROP COLUMN chargeback_count,
DROP COLUMN email_consent,
DROP COLUMN sms_consent,
DROP COLUMN whatsapp_consent,
DROP COLUMN marketing_consent,
DROP COLUMN data_export_requested_at,
DROP COLUMN deletion_requested_at;
