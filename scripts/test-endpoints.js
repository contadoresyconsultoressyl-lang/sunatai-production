// Testing SUNAT endpoint WITHOUT trailing slash

const testEndpoints = async () => {
    console.log("🔍 Testing SUNAT OAuth2 endpoints...\n");

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('scope', 'https://api.sunat.gob.pe/v1/contribuyente/migeigv');
    params.append('client_id', '32f16daf-2772-4c3e-8a9a-cb831efca40d');
    params.append('client_secret', 'Yt6vbm1y19CeYLsXiR1RZg==');
    params.append('username', '10448063432ESTRIVER');
    params.append('password', 'oscrattle');

    const endpoints = [
        'https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token/',
        'https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token',
        'https://api-seguridad.sunat.gob.pe/v1/clientesextranet/oauth2/token/',
        'https://api-seguridad.sunat.gob.pe/v1/clientesextranet/oauth2/token',
    ];

    for (const endpoint of endpoints) {
        console.log(`\n${"=".repeat(70)}`);
        console.log(`Testing: ${endpoint}`);
        console.log("=".repeat(70));

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log("Status:", response.status, response.statusText);
            console.log("Content-Type:", response.headers.get('content-type'));

            const rawText = await response.text();

            if (response.status === 200) {
                console.log("✅ SUCCESS!");
                try {
                    const data = JSON.parse(rawText);
                    console.log("Token Type:", data.token_type);
                    console.log("Expires in:", data.expires_in);
                } catch {
                    console.log("Response:", rawText.substring(0, 200));
                }
            } else if (response.status === 404) {
                console.log("❌ 404 - Endpoint no existe");
            } else {
                try {
                    const data = JSON.parse(rawText);
                    console.log("❌ Error:", data.error);
                    console.log("Description:", data.error_description);
                } catch {
                    console.log("❌ Response (HTML):", rawText.substring(0, 100));
                }
            }
        } catch (err) {
            console.log("💥 Request failed:", err.message);
        }
    }
};

testEndpoints();
