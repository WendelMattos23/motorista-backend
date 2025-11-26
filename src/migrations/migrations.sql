-- src/migrations/migrations.sql

-- contas
CREATE TABLE IF NOT EXISTS contas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL
);

-- motoristas
CREATE TABLE IF NOT EXISTS motoristas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- pacotes_bipados
CREATE TABLE IF NOT EXISTS pacotes_bipados (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(120) NOT NULL,
  conta_id INT REFERENCES contas(id) ON DELETE SET NULL,
  motorista_id INT REFERENCES motoristas(id) ON DELETE SET NULL,
  entregue BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT NOW()
);