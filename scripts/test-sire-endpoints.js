// Probando diferentes variantes del endpoint SIRE

const client_id = '32f16daf-2772-4c3e-8a9a-cb831efca40d';
const tokenEndpoint = `https://api-seguridad.sunat.gob.pe/v1/clientessol/${client_id}/oauth2/token/`;

const params = new URLSearchParams();
params.append('grant_type', 'password');
params.append('scope', 'https://api.sunat.gob.pe/v1/contribuyente/migeigv');
params.append('client_id', client_id);
params.append('client_secret', 'Yt6vbm1y19CeYLsXiR1RZg==');
params.append('username', '10448063432ESTRIVER');
params.append('password', 'oscrattle');

async function testSireEndpoints() {
    console.log("🔐 Obteniendo token...\n");

    const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log("✅ Token obtenido\n");

    const ruc = '10448063432';
    const periodo = '202412';

    const endpoints = [
        `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/${ruc}/compras/${periodo}`,
        `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvicrce/${ruc}/compras/${periodo}`,
        `https://api.sunat.gob.pe/v1/contribuyente/migeigv/${ruc}/compras/${periodo}`,
        `https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvie/compras/${ruc}/${periodo}`,
    ];

    for (const endpoint of endpoints) {
        console.log(`\nProbando: ${endpoint}`);
        console.log("=".repeat(70));

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Status:", response.status, response.statusText);

            if (response.status === 200) {
                const data = await response.json();
                console.log("✅ ÉXITO!");
                console.log("Keys:", Object.keys(data));
                console.log("Comprobantes:", data.msgeigvMovOCompra?.length || data.length || "Unknown structure");
                break;
            } else {
                const text = await response.text();
                console.log("❌ Error. Response (first 200 chars):", text.substring(0, 200));
            }
        } catch (err) {
            console.log("💥 Request failed:", err.message);
        }
    }
}

testSireEndpoints();
