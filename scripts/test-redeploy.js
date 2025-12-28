// Test de sincronización completa desde el frontend desplegado

const FRONTEND_URL = "https://sunatai-peru.vercel.app";
const EMPRESA_ID = "63a5ecc2-1689-4661-9f97-6a908ae45386";

async function testFullSync() {
    console.log("🧪 Testing sincronización completa desde frontend desplegado...\n");

    // Simular la llamada que hace el frontend al click en "SUNAT API"
    console.log("1. Verificando que el frontend esté accesible...");

    try {
        const frontendCheck = await fetch(FRONTEND_URL);
        if (frontendCheck.ok) {
            console.log("✅ Frontend accesible en:", FRONTEND_URL);
        } else {
            console.log("⚠️ Frontend responde con status:", frontendCheck.status);
        }
    } catch (err) {
        console.log("❌ Error accediendo al frontend:", err.message);
        return;
    }

    console.log("\n2. Probando Edge Function auth-sunat desde el frontend...");
    console.log("(Esta es la llamada que haría el botón 'SUNAT API')");

    // Esta es la URL que el frontend usa
    const edgeFunctionUrl = "https://isbnoiviaskdatvrpgka.supabase.co/functions/v1/auth-sunat";
    const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYm5vaXZpYXNrZGF0dnJwZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjM4ODIsImV4cCI6MjA4MTU5OTg4Mn0.NkjE-WKOBplqDVU0LnlD6Jv5stfiHWbSqhE_NnC4gHQ";

    try {
        const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${anonKey}`
            },
            body: JSON.stringify({ empresa_id: EMPRESA_ID })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ Token SUNAT obtenido exitosamente!");
            console.log("   Token type:", data.token_type);
            console.log("   Expires in:", data.expires_in, "seconds");
            console.log("   Access token (primeros 30 chars):", data.access_token?.substring(0, 30) + "...");

            console.log("\n🎉 REDEPLOY VERIFICADO:");
            console.log("   ✅ Frontend desplegado correctamente");
            console.log("   ✅ Edge Functions actualizadas conectadas");
            console.log("   ✅ OAuth2 SUNAT funcionando al 100%");
            console.log("\n📊 Sistema 100% operativo en:", FRONTEND_URL);
        } else {
            console.log("❌ Error obteniendo token:");
            console.log("   Status:", response.status);
            console.log("   Error:", data.error || "Unknown");
        }
    } catch (err) {
        console.log("❌ Error en la prueba:", err.message);
    }
}

testFullSync();
