// Testing direct SUNAT API call with the credentials

const testDirectSunat = async () => {
    console.log("🔍 Testing DIRECT SUNAT API call...\n");

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('scope', 'https://api.sunat.gob.pe/v1/contribuyente/migeigv');
    params.append('client_id', '32f16daf-2772-4c3e-8a9a-cb831efca40d');
    params.append('client_secret', 'Yt6vbm1y19CeYLsXiR1RZg==');
    params.append('username', '10448063432ESTRIVER');
    params.append('password', 'oscrattle');

    console.log("📤 Request to SUNAT:");
    console.log("URL: https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token/");
    console.log("Body:", params.toString());
    console.log("");

    try {
        const response = await fetch('https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token/', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await response.json();

        console.log("📊 SUNAT Response Status:", response.status);
        console.log("📄 SUNAT Response Body:");
        console.log(JSON.stringify(data, null, 2));

        if (data.error) {
            console.log("\n❌ SUNAT ERROR:");
            console.log("Error:", data.error);
            console.log("Description:", data.error_description);

            if (data.error === 'invalid_client') {
                console.log("\n💡 El client_id o client_secret son incorrectos o no están activados en el portal SOL.");
            } else if (data.error === 'invalid_grant') {
                console.log("\n💡 El usuario/contraseña son incorrectos O la URL de la aplicación registrada en SOL no coincide.");
            }
        } else {
            console.log("\n✅ SUCCESS! SUNAT token obtenido.");
            console.log("Token type:", data.token_type);
            console.log("Expires in:", data.expires_in, "seconds");
        }
    } catch (err) {
        console.error("\n💥 Error:", err.message);
    }
};

testDirectSunat();
