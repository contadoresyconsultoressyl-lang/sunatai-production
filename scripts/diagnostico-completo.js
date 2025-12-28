// DIAGNÓSTICO COMPLETO DEL SISTEMA SUNATAI

const SUPABASE_URL = "https://isbnoiviaskdatvrpgka.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYm5vaXZpYXNrZGF0dnJwZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjM4ODIsImV4cCI6MjA4MTU5OTg4Mn0.NkjE-WKOBplqDVU0LnlD6Jv5stfiHWbSqhE_NnC4gHQ";

async function diagnosticoCompleto() {
    console.log("═".repeat(70));
    console.log("🔍 DIAGNÓSTICO COMPLETO - SUNATAI");
    console.log("═".repeat(70));
    console.log("");

    // 1. Verificar conexión a Supabase
    console.log("1️⃣ VERIFICANDO CONEXIÓN A SUPABASE:");
    console.log("-".repeat(70));
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });
        if (response.ok || response.status === 404) {
            console.log("✅ Conexión a Supabase: OK");
        } else {
            console.log("❌ Conexión a Supabase: FALLO (" + response.status + ")");
        }
    } catch (err) {
        console.log("❌ Error de red:", err.message);
    }
    console.log("");

    // 2. Verificar tabla empresas
    console.log("2️⃣ VERIFICANDO TABLA 'empresas':");
    console.log("-".repeat(70));
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/empresas?select=*`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Tabla empresas accesible");
            console.log("📊 Número de empresas registradas:", data.length);
            if (data.length > 0) {
                console.log("\n📋 Empresas encontradas:");
                data.forEach((emp, i) => {
                    console.log(`   ${i + 1}. ${emp.razon_social} (RUC: ${emp.ruc})`);
                });
            } else {
                console.log("⚠️ No hay empresas registradas en la tabla");
            }
        } else {
            const error = await response.text();
            console.log("❌ Error accediendo a tabla empresas:", response.status);
            console.log("   Detalle:", error.substring(0, 200));
        }
    } catch (err) {
        console.log("❌ Error:", err.message);
    }
    console.log("");

    // 3. Verificar tabla registros_sire
    console.log("3️⃣ VERIFICANDO TABLA 'registros_sire':");
    console.log("-".repeat(70));
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/registros_sire?select=*`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Tabla registros_sire accesible");
            console.log("📊 Número de registros:", data.length);
            if (data.length > 0) {
                data.forEach((reg, i) => {
                    const numFacturas = reg.contenido_json?.length || 0;
                    console.log(`   ${i + 1}. Periodo: ${reg.periodo}, Facturas: ${numFacturas}, Estado: ${reg.estado_sire}`);
                });
            } else {
                console.log("⚠️ No hay registros SIRE en la tabla");
            }
        } else {
            console.log("❌ Error accediendo a tabla registros_sire:", response.status);
        }
    } catch (err) {
        console.log("❌ Error:", err.message);
    }
    console.log("");

    // 4. Verificar Edge Function auth-sunat
    console.log("4️⃣ VERIFICANDO EDGE FUNCTION 'auth-sunat':");
    console.log("-".repeat(70));
    try {
        const empresaId = "63a5ecc2-1689-4661-9f97-6a908ae45386"; // CERDA PALOMINO YOVANA

        const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-sunat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ANON_KEY}`
            },
            body: JSON.stringify({ empresa_id: empresaId })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Edge Function auth-sunat: OK");
            console.log("✅ Token SUNAT obtenido exitosamente");
            console.log("   Token type:", data.token_type);
            console.log("   Expires in:", data.expires_in, "seconds");
        } else {
            console.log("❌ Error en Edge Function:", response.status);
            console.log("   Error:", data.error);
        }
    } catch (err) {
        console.log("❌ Error llamando a Edge Function:", err.message);
    }
    console.log("");

    // 5. Verificar variables de entorno en Vercel
    console.log("5️⃣ VERIFICANDO DEPLOYMENT EN VERCEL:");
    console.log("-".repeat(70));
    try {
        const response = await fetch("https://sunatai-peru.vercel.app/");
        if (response.ok) {
            console.log("✅ Frontend accesible en Vercel");
            console.log("   URL:", "https://sunatai-peru.vercel.app");
        } else {
            console.log("❌ Frontend no accesible:", response.status);
        }
    } catch (err) {
        console.log("❌ Error:", err.message);
    }
    console.log("");

    // RESUMEN FINAL
    console.log("═".repeat(70));
    console.log("📊 RESUMEN DEL DIAGNÓSTICO");
    console.log("═".repeat(70));
    console.log("");
    console.log("PROBLEMAS IDENTIFICADOS:");
    console.log("• Si tabla empresas está vacía → Usuario debe registrar empresa primero");
    console.log("• Si tabla registros_sire está vacía → Debe hacer sync o simulación");
    console.log("• Si Edge Function falla → Verificar secrets en Supabase");
    console.log("• Si frontend no carga → Verificar deployment en Vercel");
    console.log("");
    console.log("PRÓXIMOS PASOS:");
    console.log("1. Ir a https://sunatai-peru.vercel.app/dashboard/nueva-empresa");
    console.log("2. Registrar una empresa con credenciales de prueba");
    console.log("3. Volver al dashboard y hacer click en 'Simular ZIP'");
    console.log("4. Ver los resultados en el detalle de la empresa");
    console.log("");
    console.log("═".repeat(70));
}

diagnosticoCompleto();
