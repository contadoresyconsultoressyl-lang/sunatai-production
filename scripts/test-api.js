
const SUPABASE_URL = "https://isbnoiviaskdatvrpgka.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI... (TRUNCATED)"; // La llave que ya tenemos activa
const EMPRESA_ID = "63a5ecc2-1689-4661-9f97-6a908ae45386"; // ID de CERDA PALOMINO YOVANA

async function testSync() {
    console.log("🚀 Iniciando sincronización real vía API...");

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-sunat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ empresa_id: EMPRESA_ID })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ ERROR SUNAT:", data.error);
            console.log("Pista: Verifica que el Client ID y Secret esten grabados con HTTPS en el portal SOL.");
            return;
        }

        console.log("✅ TOKEN OBTENIDO:", data.access_token.substring(0, 15) + "...");
    } catch (err) {
        console.error("Error de red:", err.message);
    }
}

testSync();
