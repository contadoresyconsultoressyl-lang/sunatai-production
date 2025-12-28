// Testing CORRECT SUNAT endpoint with client_id in URL

const testCorrectEndpoint = async () => {
    console.log("🔍 Testing CORRECT SUNAT OAuth2 endpoint...\n");

    const client_id = '32f16daf-2772-4c3e-8a9a-cb831efca40d';
    const endpoint = `https://api-seguridad.sunat.gob.pe/v1/clientessol/${client_id}/oauth2/token/`;

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('scope', 'https://api.sunat.gob.pe/v1/contribuyente/migeigv');
    params.append('client_id', client_id);
    params.append('client_secret', 'Yt6vbm1y19CeYLsXiR1RZg==');
    params.append('username', '10448063432ESTRIVER');
    params.append('password', 'oscrattle');

    console.log("📤 Request to SUNAT:");
    console.log("URL:", endpoint);
    console.log("");

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log("📊 Response Status:", response.status, response.statusText);
        console.log("📊 Content-Type:", response.headers.get('content-type'));

        const rawText = await response.text();

        if (response.status === 200) {
            console.log("\n✅ SUCCESS!");
            const data = JSON.parse(rawText);
            console.log("Token Type:", data.token_type);
            console.log("Expires in:", data.expires_in, "seconds");
            console.log("Access Token (first 30 chars):", data.access_token.substring(0, 30) + "...");
        } else {
            try {
                const data = JSON.parse(rawText);
                console.log("\n❌ ERROR:");
                console.log("Error:", data.error);
                console.log("Description:", data.error_description);

                if (data.error === 'invalid_client') {
                    console.log("\n💡 El client_id o client_secret son incorrectos.");
                } else if (data.error === 'invalid_grant') {
                    console.log("\n💡 El usuario/contraseña son incorrectos.");
                    console.log("Verifica que el usuario SOL esté activo y la contraseña sea correcta.");
                }
            } catch {
                console.log("\n❌ Non-JSON Response:");
                console.log(rawText.substring(0, 300));
            }
        }
    } catch (err) {
        console.error("\n💥 Error:", err.message);
    }
};

testCorrectEndpoint();
