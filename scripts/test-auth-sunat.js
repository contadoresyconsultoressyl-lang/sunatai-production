// Using native fetch (Node 18+)

const SUPABASE_URL = "https://isbnoiviaskdatvrpgka.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYm5vaXZpYXNrZGF0dnJwZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjM4ODIsImV4cCI6MjA4MTU5OTg4Mn0.NkjE-WKOBplqDVU0LnlD6Jv5stfiHWbSqhE_NnC4gHQ";
const EMPRESA_ID = "63a5ecc2-1689-4661-9f97-6a908ae45386"; // CERDA PALOMINO YOVANA

async function testAuthSunat() {
    console.log("🔍 Testing auth-sunat Edge Function...\n");

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-sunat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ANON_KEY}`
            },
            body: JSON.stringify({ empresa_id: EMPRESA_ID })
        });

        const data = await response.json();

        console.log("📊 Response Status:", response.status);
        console.log("📊 Response Headers:", JSON.stringify(Object.fromEntries(response.headers), null, 2));
        console.log("\n📄 Response Body:");
        console.log(JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.log("\n❌ ERROR DETECTED:");
            console.log("Status Code:", response.status);
            console.log("Error Message:", data.error || "Unknown error");

            // Suggestions based on error
            if (data.error && data.error.includes("Empresa no encontrada")) {
                console.log("\n💡 Solución: Verifica que el empresa_id exista en Supabase.");
            } else if (data.error && data.error.includes("ENCRYPTION_KEY")) {
                console.log("\n💡 Solución: Configura ENCRYPTION_KEY en Supabase Secrets.");
            } else if (data.error && data.error.includes("SUNAT")) {
                console.log("\n💡 Solución: Verifica SUNAT_CLIENT_ID y SUNAT_CLIENT_SECRET en Supabase Secrets.");
                console.log("También verifica que las credenciales sean correctas en el portal SOL.");
            }
        } else {
            console.log("\n✅ SUCCESS! Token obtenido.");
            console.log("Access Token (first 30 chars):", data.access_token?.substring(0, 30) + "...");
        }
    } catch (err) {
        console.error("\n💥 Network/Connection Error:", err.message);
    }
}

testAuthSunat();
