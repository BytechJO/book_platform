const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 🔥 نجرب الاتصال مباشرة
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL Connected ✅');
  } catch (err) {
    console.error('Database connection failed ❌', err);
    process.exit(1);
  }
})();

module.exports = pool;