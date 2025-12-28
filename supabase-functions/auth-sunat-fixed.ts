
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function decrypt(encryptedBase64: string, keyStr: string) {
    const encoder = new TextEncoder();
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const keyBuffer = encoder.encode(keyStr.padEnd(32, '0').slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-GCM' }, false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data);
    return new TextDecoder().decode(decrypted);
}

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const { empresa_id } = await req.json()
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: empresa, error } = await supabaseAdmin
            .from('empresas')
            .select('*')
            .eq('id', empresa_id)
            .single()

        if (error || !empresa) throw new Error('Empresa no encontrada')

        const encryptionKey = Deno.env.get('ENCRYPTION_KEY') ?? '';
        if (!encryptionKey) throw new Error('Falta ENCRYPTION_KEY en el servidor');

        const usuarioSol = await decrypt(empresa.sunat_usuario_sol, encryptionKey);
        const claveSol = await decrypt(empresa.sunat_clave_sol, encryptionKey);

        const client_id = Deno.env.get('SUNAT_CLIENT_ID') ?? '';
        const client_secret = Deno.env.get('SUNAT_CLIENT_SECRET') ?? '';

        if (!client_id || !client_secret) throw new Error('Faltan credenciales de Cliente SUNAT (ClientId/Secret)');

        const username = `${empresa.ruc}${usuarioSol.toUpperCase()}`;
        const password = claveSol;

        console.log(`Intentando login para RUC: ${empresa.ruc}, Usuario: ${usuarioSol.toUpperCase()}`);

        // ENDPOINT CORRECTO: client_id en la URL
        const tokenEndpoint = `https://api-seguridad.sunat.gob.pe/v1/clientessol/${client_id}/oauth2/token/`;

        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('scope', 'https://api.sunat.gob.pe/v1/contribuyente/migeigv');
        params.append('client_id', client_id);
        params.append('client_secret', client_secret);
        params.append('username', username);
        params.append('password', password);

        const sunatResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const tokenData = await sunatResponse.json();

        if (tokenData.error) {
            console.error('Error de SUNAT OAuth2:', tokenData);
            throw new Error(`SUNAT: ${tokenData.error_description || tokenData.error}`);
        }

        return new Response(JSON.stringify(tokenData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Error en auth-sunat:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
})
