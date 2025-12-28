const SUPABASE_URL = "https://isbnoiviaskdatvrpgka.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYm5vaXZpYXNrZGF0dnJwZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjM4ODIsImV4cCI6MjA4MTU5OTg4Mn0.NkjE-WKOBplqDVU0LnlD6Jv5stfiHWbSqhE_NnC4gHQ";

async function diagnostico() {
    const results = {
        supabase_connection: false,
        empresas_count: 0,
        empresas_list: [],
        registros_sire_count: 0,
        edge_function_working: false,
        frontend_accessible: false
    };

    // 1. Tabla empresas
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/empresas?select=*`, {
            headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
        });
        if (res.ok) {
            const data = await res.json();
            results.supabase_connection = true;
            results.empresas_count = data.length;
            results.empresas_list = data.map(e => ({ ruc: e.ruc, razon_social: e.razon_social }));
        }
    } catch (err) { }

    // 2. Tabla registros_sire
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/registros_sire?select=*`, {
            headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` }
        });
        if (res.ok) {
            const data = await res.json();
            results.registros_sire_count = data.length;
        }
    } catch (err) { }

    // 3. Edge Function
    try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/auth-sunat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` },
            body: JSON.stringify({ empresa_id: "63a5ecc2-1689-4661-9f97-6a908ae45386" })
        });
        results.edge_function_working = res.ok;
    } catch (err) { }

    // 4. Frontend
    try {
        const res = await fetch("https://sunatai-peru.vercel.app/");
        results.frontend_accessible = res.ok;
    } catch (err) { }

    console.log(JSON.stringify(results, null, 2));
}

diagnostico();
