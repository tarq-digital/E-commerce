const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'weebster_dev',
  multipleStatements: true, // Crucial for running SQL files
};

const migrationsDir = path.join(__dirname, '../database/migrations');

async function runMigrations() {
  const direction = process.argv[2] === 'down' ? 'down' : 'up';
  
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(`🔌 Connected to database ${dbConfig.database}`);
    
    // Ensure migrations table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(`.${direction}.sql`)).sort();

    for (const file of files) {
      const migrationName = file.replace(`.${direction}.sql`, '');
      
      const [rows] = await connection.query('SELECT * FROM migrations WHERE name = ?', [migrationName]);
      const isApplied = rows.length > 0;

      if (direction === 'up' && !isApplied) {
        console.log(`⏳ Applying migration: ${file}...`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await connection.query(sql);
        await connection.query('INSERT INTO migrations (name) VALUES (?)', [migrationName]);
        console.log(`✅ Applied: ${file}`);
      } else if (direction === 'down' && isApplied) {
        console.log(`⏳ Reverting migration: ${file}...`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await connection.query(sql);
        await connection.query('DELETE FROM migrations WHERE name = ?', [migrationName]);
        console.log(`🔙 Reverted: ${file}`);
      } else {
        console.log(`⏭️ Skipped ${file} (Already ${direction === 'up' ? 'applied' : 'reverted'})`);
      }
    }

    console.log('🎉 Migration process completed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runMigrations();
