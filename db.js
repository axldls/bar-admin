require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	host: process.env.PGHOST,
	port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
	database: process.env.PGDATABASE,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD,
	max: process.env.PGPOOL_MAX ? Number(process.env.PGPOOL_MAX) : 10,
	idleTimeoutMillis: process.env.PGIDLE_TIMEOUT_MS
		? Number(process.env.PGIDLE_TIMEOUT_MS)
		: 30000,
	connectionTimeoutMillis: process.env.PGCONNECT_TIMEOUT_MS
		? Number(process.env.PGCONNECT_TIMEOUT_MS)
		: 5000,
	ssl: process.env.NODE_ENV === 'production'
		? { rejectUnauthorized: false }
		: undefined,
});

pool.on('error', (error) => {
	console.error('Unexpected PostgreSQL pool error:', error);
});

module.exports = pool;
