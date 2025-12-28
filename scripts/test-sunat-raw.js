// Testing direct SUNAT API call - Capturing raw response

const testDirectSunatRaw = async () => {
    console.log("🔍 Testing DIRECT SUNAT API call (capturing raw HTML)...\n");

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('scope', 'https://api.sunat.gob.pe/v1/contribuyente/migeigv');
    params.append('client_id', '32f16daf-2772-4c3e-8a9a-cb831efca40d');
    params.append('client_secret', 'Yt6vbm1y19CeYLsXiR1RZg==');
    params.append('username', '10448063432ESTRIVER');
    params.append('password', 'oscrattle');

    console.log("📤 Request to SUNAT:");
    console.log("URL: https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token/");
    console.log("");

    try {
        const response = await fetch('https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token/', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const rawText = await response.text();

        console.log("📊 SUNAT Response Status:", response.status);
        console.log("📊 Content-Type:", response.headers.get('content-type'));
        console.log("\n📄 RAW Response (first 500 chars):");
        console.log(rawText.substring(0, 500));
        console.log("\n...\n");

        // Try to parse as JSON if possible
        try {
            const data = JSON.parse(rawText);
            console.log("\n✅ Response is valid JSON:");
            console.log(JSON.stringify(data, null, 2));

            if (data.error) {
                console.log("\n❌ SUNAT ERROR:");
                console.log("Error:", data.error);
                console.log("Description:", data.error_description);
            }
        } catch {
            console.log("\n⚠️ Response is NOT JSON (likely HTML error page)");
            console.log("This means SUNAT rejected the request before authentication.");
            console.log("\n💡 Posibles causas:");
            console.log("1. La URL de la aplicación en el Portal SOL no coincide con: https://sunatai-peru.vercel.app");
            console.log("2. El client_id o client_secret no están activados correctamente.");
            console.log("3. La aplicación en SOL está en estado 'Borrador' o 'Inactiva'.");
        }
    } catch (err) {
        console.error("\n💥 Network Error:", err.message);
    }
};

testDirectSunatRaw();
