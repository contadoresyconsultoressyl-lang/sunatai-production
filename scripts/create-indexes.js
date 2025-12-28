// Script para crear índices en Supabase vía API

const SUPABASE_URL = "https://isbnoiviaskdatvrpgka.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYm5vaXZpYXNrZGF0dnJwZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjM4ODIsImV4cCI6MjA4MTU5OTg4Mn0.NkjE-WKOBplqDVU0LnlD6Jv5stfiHWbSqhE_NnC4gHQ";

const queries = [
    "CREATE INDEX IF NOT EXISTS idx_empresas_contador_id ON empresas(contador_id);",
    "CREATE INDEX IF NOT EXISTS idx_empresas_created_at ON empresas(created_at DESC);",
    "CREATE INDEX IF NOT EXISTS idx_registros_sire_empresa_id ON registros_sire(empresa_id);",
    "CREATE INDEX IF NOT EXISTS idx_registros_sire_periodo ON registros_sire(periodo);",
    "CREATE INDEX IF NOT EXISTS idx_registros_sire_empresa_periodo ON registros_sire(empresa_id, periodo);",
    "CREATE INDEX IF NOT EXISTS idx_registros_sire_tipo ON registros_sire(tipo_registro);",
    "CREATE INDEX IF NOT EXISTS idx_registros_sire_lookup ON registros_sire(empresa_id, periodo, tipo_registro);"
];

async function createIndexes() {
    console.log("Creando índices en Supabase para mejorar performance...\n");

    for (const query of queries) {
        console.log("Ejecutando:", query.substring(0, 80) + "...");

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`
                },
                body: JSON.stringify({ query })
            });

            if (response.ok) {
                console.log("✅ Índice creado exitosamente");
            } else {
                console.log("⚠️ No se pudo crear (puede que ya exista o falta permisos)");
            }
        } catch (err) {
            console.log("⚠️ Error:", err.message);
        }
    }

    console.log("\n✅ Proceso completado. Los índices mejorarán la velocidad de queries.");
    console.log("Nota: Algunos índices pueden no haberse creado si ya existen.");
}

createIndexes();
