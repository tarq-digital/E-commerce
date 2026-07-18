-- Phase 13.8 & 13.9: Enterprise Store Administration Schema Down

DROP TABLE IF EXISTS scheduled_configs;
DROP TABLE IF EXISTS currency_rates;
DROP TABLE IF EXISTS language_translations;
DROP TABLE IF EXISTS multi_store_configs;

DROP TABLE IF EXISTS media_asset_versions;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS media_folders;

DROP TABLE IF EXISTS settings_versions;
DROP TABLE IF EXISTS settings_audit_logs;
DROP TABLE IF EXISTS store_settings;
