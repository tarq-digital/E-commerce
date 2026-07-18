const SettingsRepository = require("../repositories/settings.repository");
const crypto = require("crypto");
require("dotenv").config();

// Simple in-memory cache for global settings to prevent hammering the DB
let settingsCache = null;

const ENCRYPTION_KEY = process.env.JWT_SECRET ? process.env.JWT_SECRET.padEnd(32, '0').slice(0, 32) : '12345678901234567890123456789012'; // 32 bytes
const IV_LENGTH = 16;

class SettingsService {
  
  encrypt(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text) {
    if (!text || !text.includes(':')) return text;
    try {
      const textParts = text.split(':');
      const iv = Buffer.from(textParts.shift(), 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (e) {
      console.error("Settings decryption failed", e);
      return null;
    }
  }

  async getAllSettings(forceRefresh = false) {
    if (settingsCache && !forceRefresh) {
      return settingsCache;
    }

    const rawSettings = await SettingsRepository.getAllSettings();
    const grouped = {};

    for (const setting of rawSettings) {
      let value = setting.setting_value;
      
      // Decrypt if secret
      if (setting.is_secret) {
         value = this.decrypt(value);
         // Mask the secret for API transmission unless explicitly requested, 
         // but for admin panel we often need to know it's set. 
         // For now, we'll return it so the frontend can populate forms, 
         // or we can send a masked version. Let's send a masked version for safety.
         value = '********'; 
      }

      // Parse JSON if needed
      if (setting.type === 'JSON') {
         try { value = JSON.parse(value); } catch(e) {}
      } else if (setting.type === 'BOOLEAN') {
         value = value === 'true';
      } else if (setting.type === 'NUMBER') {
         value = Number(value);
      }

      if (!grouped[setting.group_name]) {
         grouped[setting.group_name] = {};
      }
      grouped[setting.group_name][setting.setting_key] = value;
    }

    settingsCache = grouped;
    return grouped;
  }

  async updateSettings(updates, req) {
    const adminId = req.user?.id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Updates should be an array of { key, value }
    const processedUpdates = [];

    for (const update of updates) {
       const existing = await SettingsRepository.getSettingByKey(update.key);
       if (!existing) continue;

       // If it's a secret and they sent ********, it means they didn't change it. Skip.
       if (existing.is_secret && update.value === '********') {
          continue;
       }

       let finalValue = update.value;

       // Validate based on rule (Future Architecture Prep)
       // if (existing.validation_rule) { ... }

       if (existing.type === 'JSON') {
          finalValue = typeof finalValue === 'object' ? JSON.stringify(finalValue) : finalValue;
       } else {
          finalValue = String(finalValue);
       }

       if (existing.is_secret) {
          finalValue = this.encrypt(finalValue);
       }

       processedUpdates.push({ key: update.key, value: finalValue });
    }

    if (processedUpdates.length > 0) {
       await SettingsRepository.bulkUpdateSettings(adminId, ipAddress, userAgent, processedUpdates);
       // Invalidate cache
       settingsCache = null;
    }

    return await this.getAllSettings(true);
  }
}

module.exports = new SettingsService();
