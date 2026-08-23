require('dotenv').config();

const { Pool } = require('pg');

const RENDER_DATABASE_URL = 'postgresql://axel123z:elNxCbo4hL6eyMs7AF4MVOaKBNwnC2sO@dpg-da5nsjbm8hqs73db7ea0-a.oregon-postgres.render.com/bar_db_onjb';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL || RENDER_DATABASE_URL,
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
	ssl: { rejectUnauthorized: false },
});

pool.on('error', (error) => {
	console.error('Unexpected PostgreSQL pool error:', error);
});

module.exports = pool;
