const express = require('express');
const pool = require('./db');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use((request, response, next) => {
	response.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
	response.header('Access-Control-Allow-Headers', 'Content-Type');
	response.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	if (request.method === 'OPTIONS') return response.sendStatus(204);
	next();
});

const parseId = (value) => {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
};

const productFields = (body) => ({
	name: body.name,
	shortDesc: body.shortDesc ?? body.short_desc ?? '',
	price: body.price,
	image: body.image ?? '',
	category: body.category,
});

const validateProduct = ({ name, price, category }) => {
	if (!name || price === undefined || price === null || !category) {
		return 'name, price y category son obligatorios';
	}
	if (!Number.isFinite(Number(price)) || Number(price) < 0) {
		return 'price debe ser un numero mayor o igual a 0';
	}
	return null;
};

const sendDatabaseError = (response, error) => {
	console.error(error);
	if (error.code === '23505') return response.status(409).json({ error: 'El producto ya existe en Happy Hour' });
	if (error.code === '23503') return response.status(404).json({ error: 'El producto no existe' });
	return response.status(500).json({ error: 'Error de base de datos' });
};

app.get('/ping', async (request, response) => {
	try {
		const result = await pool.query('SELECT NOW() AS now');
		response.json({ ok: true, now: result.rows[0].now });
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

app.get('/productos', async (request, response) => {
	try {
		const result = await pool.query('SELECT * FROM productos');
		response.json(result.rows);
	} catch (error) {
		console.error(error);
		response.status(500).send('Error en la base de datos');
	}
});

app.get('/productos/:id', async (request, response) => {
	const id = parseId(request.params.id);
	if (!id) return response.status(400).json({ error: 'id invalido' });

	try {
		const result = await pool.query(`
			SELECT id, nombre AS name, descripcion AS "shortDesc", precio AS price,
				imagen_url AS image, categoria AS category
			FROM productos
			WHERE id = $1
		`, [id]);
		if (!result.rowCount) return response.status(404).json({ error: 'Producto no encontrado' });
		response.json(result.rows[0]);
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

app.post('/productos', async (request, response) => {
	const product = productFields(request.body);
	const validationError = validateProduct(product);
	if (validationError) return response.status(400).json({ error: validationError });

	try {
		const result = await pool.query(`
			INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, nombre AS name, descripcion AS "shortDesc", precio AS price,
				imagen_url AS image, categoria AS category
		`, [product.name, product.shortDesc, Number(product.price), product.image, product.category]);
		response.status(201).json(result.rows[0]);
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

app.put('/productos/:id', async (request, response) => {
	const id = parseId(request.params.id);
	if (!id) return response.status(400).json({ error: 'id invalido' });
	const product = productFields(request.body);
	const validationError = validateProduct(product);
	if (validationError) return response.status(400).json({ error: validationError });

	try {
		const result = await pool.query(`
			UPDATE productos
			SET nombre = $1, descripcion = $2, precio = $3, imagen_url = $4, categoria = $5
			WHERE id = $6
			RETURNING id, nombre AS name, descripcion AS "shortDesc", precio AS price,
				imagen_url AS image, categoria AS category
		`, [product.name, product.shortDesc, Number(product.price), product.image, product.category, id]);
		if (!result.rowCount) return response.status(404).json({ error: 'Producto no encontrado' });
		response.json(result.rows[0]);
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

app.delete('/productos/:id', async (request, response) => {
	const id = parseId(request.params.id);
	if (!id) return response.status(400).json({ error: 'id invalido' });

	try {
		const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);
		if (!result.rowCount) return response.status(404).json({ error: 'Producto no encontrado' });
		response.sendStatus(204);
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

const happyHourQuery = `
	SELECT hh.id, hh.producto_id AS "productoId", p.nombre AS name,
		p.descripcion AS "shortDesc", p.precio AS price, p.imagen_url AS image,
		p.categoria AS category, hh.precio_especial AS "offerPrice", hh.promo
	FROM happy_hour hh
	JOIN productos p ON p.id = hh.producto_id
`;

const getHappyHour = async (request, response) => {
	try {
		const result = await pool.query(`${happyHourQuery} ORDER BY hh.id DESC`);
		response.json(result.rows);
	} catch (error) {
		sendDatabaseError(response, error);
	}
};

app.get(['/happyhour', '/happy_hour'], getHappyHour);

app.post('/happy_hour', async (request, response) => {
	const productoId = parseId(request.body.producto_id ?? request.body.productoId ?? request.body.productId);
	if (!productoId) return response.status(400).json({ error: 'producto_id es obligatorio y debe ser valido' });

	try {
		const result = await pool.query(`
			INSERT INTO happy_hour (producto_id, precio_especial, promo)
			VALUES ($1, $2, $3)
			RETURNING id
		`, [productoId, request.body.offer_price ?? request.body.offerPrice ?? null, request.body.promo ?? null]);
		const joined = await pool.query(`${happyHourQuery} WHERE hh.id = $1`, [result.rows[0].id]);
		response.status(201).json(joined.rows[0]);
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

app.put('/happy_hour/:id', async (request, response) => {
	const id = parseId(request.params.id);
	if (!id) return response.status(400).json({ error: 'id invalido' });
	const productoId = parseId(request.body.producto_id ?? request.body.productoId ?? request.body.productId);
	if (!productoId) return response.status(400).json({ error: 'producto_id es obligatorio y debe ser valido' });

	try {
		const result = await pool.query(`
			UPDATE happy_hour
			SET producto_id = $1, precio_especial = $2, promo = $3
			WHERE id = $4
			RETURNING id
		`, [productoId, request.body.offer_price ?? request.body.offerPrice ?? null, request.body.promo ?? null, id]);
		if (!result.rowCount) return response.status(404).json({ error: 'Oferta no encontrada' });
		const joined = await pool.query(`${happyHourQuery} WHERE hh.id = $1`, [id]);
		response.json(joined.rows[0]);
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

app.delete('/happy_hour/:productoId', async (request, response) => {
	const productoId = parseId(request.params.productoId);
	if (!productoId) return response.status(400).json({ error: 'producto_id invalido' });

	try {
		const result = await pool.query('DELETE FROM happy_hour WHERE producto_id = $1 RETURNING id', [productoId]);
		if (!result.rowCount) return response.status(404).json({ error: 'Producto no esta en Happy Hour' });
		response.sendStatus(204);
	} catch (error) {
		sendDatabaseError(response, error);
	}
});

app.use((error, request, response, next) => {
	if (error instanceof SyntaxError && error.status === 400 && error.type === 'entity.parse.failed') {
		return response.status(400).json({ error: 'JSON invalido' });
	}
	next(error);
});

const server = app.listen(port, () => {
	console.log(`API escuchando en http://localhost:${port}`);
});

const shutdown = () => {
	server.close(() => {
		pool.end().finally(() => process.exit(0));
	});
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = { app, server };
