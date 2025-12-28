-- ÍNDICES PARA OPTIMIZAR PERFORMANCE DE QUERIES

-- Índice en tabla empresas para búsquedas por contador_id
CREATE INDEX IF NOT EXISTS idx_empresas_contador_id ON empresas(contador_id);
CREATE INDEX IF NOT EXISTS idx_empresas_created_at ON empresas(created_at DESC);

-- Índices en tabla registros_sire para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_registros_sire_empresa_id ON registros_sire(empresa_id);
CREATE INDEX IF NOT EXISTS idx_registros_sire_periodo ON registros_sire(periodo);
CREATE INDEX IF NOT EXISTS idx_registros_sire_empresa_periodo ON registros_sire(empresa_id, periodo);
CREATE INDEX IF NOT EXISTS idx_registros_sire_tipo ON registros_sire(tipo_registro);

-- Índice compuesto para queries comunes
CREATE INDEX IF NOT EXISTS idx_registros_sire_lookup ON registros_sire(empresa_id, periodo, tipo_registro);
