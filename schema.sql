CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL DEFAULT '',
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    categoria VARCHAR(100) NOT NULL,
    imagen_url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS happy_hour (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL UNIQUE REFERENCES productos(id) ON DELETE CASCADE,
    precio_especial NUMERIC(10, 2) CHECK (precio_especial IS NULL OR precio_especial >= 0),
    promo VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
