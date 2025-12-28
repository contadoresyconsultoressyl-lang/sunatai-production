// Script completo para sincronizar datos reales de SUNAT

const SUPABASE_URL = "https://isbnoiviaskdatvrpgka.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYm5vaXZpYXNrZGF0dnJwZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjM4ODIsImV4cCI6MjA4MTU5OTg4Mn0.NkjE-WKOBplqDVU0LnlD6Jv5stfiHWbSqhE_NnC4gHQ";
const EMPRESA_ID = "63a5ecc2-1689-4661-9f97-6a908ae45386";

async function fullSunatSync() {
    console.log("🚀 Iniciando sincronización completa con SUNAT...\n");

    // Paso 1: Obtener token
    console.log("📝 Paso 1: Obteniendo token de SUNAT...");

    const client_id = '32f16daf-2772-4c3e-8a9a-cb831efca40d';
    const tokenEndpoint = `https://api-seguridad.sunat.gob.pe/v1/clientessol/${client_id}/oauth2/token/`;

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('scope', 'https://api.sunat.gob.pe/v1/contribuyente/migeigv');
    params.append('client_id', client_id);
    params.append('client_secret', 'Yt6vbm1y19CeYLsXiR1RZg==');
    params.append('username', '10448063432ESTRIVER');
    params.append('password', 'oscrattle');

    const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!tokenResponse.ok) {
        console.error("❌ Error obteniendo token:", tokenResponse.status);
        return;
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log("✅ Token obtenido exitosamente");
    console.log("Token expires in:", tokenData.expires_in, "seconds\n");

    // Paso 2: Obtener datos SIRE de compras
    console.log("📝 Paso 2: Descargando comprobantes de Diciembre 2024...");

    const ruc = '10448063432';
    const periodo = '202412';
    const sireUrl = `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/${ruc}/compras/${periodo}`;

    const sireResponse = await fetch(sireUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!sireResponse.ok) {
        console.error("❌ Error descargando datos SIRE:", sireResponse.status);
        const errorText = await sireResponse.text();
        console.error("Response:", errorText.substring(0, 500));
        return;
    }

    const sireData = await sireResponse.json();
    console.log("✅ Datos descargados exitosamente");
    console.log("Número de comprobantes:", sireData.msgeigvMovOCompra?.length || 0);

    const facturas = sireData.msgeigvMovOCompra || [];

    // Calcular totales
    let totalBase = 0;
    let totalIgv = 0;
    let totalGeneral = 0;

    facturas.forEach(f => {
        totalBase += f.mtoBaseImponibleGrav || 0;
        totalIgv += f.mtoIgvIpm || 0;
        totalGeneral += f.mtoTotalCP || 0;
    });

    console.log("\n📊 TOTALES DESCARGADOS:");
    console.log("Total Base Imponible: S/", totalBase.toFixed(2));
    console.log("Total IGV:", "S/", totalIgv.toFixed(2));
    console.log("Total General:", "S/", totalGeneral.toFixed(2));

    // Paso 3: Guardar en Supabase
    console.log("\n📝 Paso 3: Guardando en base de datos...");

    const record = {
        empresa_id: EMPRESA_ID,
        periodo: periodo,
        tipo_registro: 'COMPRAS',
        contenido_json: facturas,
        estado_sire: 'SINCERIZADO',
        resumen_totales: {
            total_base: totalBase,
            total_igv: totalIgv,
            total_general: totalGeneral,
            num_comprobantes: facturas.length
        },
        created_at: new Date().toISOString()
    };

    const saveResponse = await fetch(`${SUPABASE_URL}/rest/v1/registros_sire`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': ANON_KEY,
            'Authorization': `Bearer ${ANON_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(record)
    });

    if (!saveResponse.ok) {
        console.error("❌ Error guardando en Supabase:", saveResponse.status);
        const errorText = await saveResponse.text();
        console.error("Response:", errorText);
        return;
    }

    console.log("✅ Datos guardados exitosamente\n");

    // Reporte final
    console.log("═".repeat(60));
    console.log("🎉 SINCRONIZACIÓN COMPLETADA EXITOSAMENTE");
    console.log("═".repeat(60));
    console.log("Empresa: CERDA PALOMINO YOVANA");
    console.log("RUC: 10448063432");
    console.log("Periodo: Diciembre 2024");
    console.log("");
    console.log("📊 RESULTADOS:");
    console.log("  • Facturas descargadas:", facturas.length);
    console.log("  • Total Base Imponible: S/", totalBase.toFixed(2));
    console.log("  • Total IGV: S/", totalIgv.toFixed(2));
    console.log("  • Total General: S/", totalGeneral.toFixed(2));
    console.log("═".repeat(60));
}

fullSunatSync().catch(err => {
    console.error("\n💥 ERROR CRÍTICO:", err.message);
    console.error(err);
});
