
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://isbnoiviaskdatvrpgka.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function seedData() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const empresa_id = "63a5ecc2-1689-4661-9f97-6a908ae45386";
    const periodo = "202412";

    console.log("Cargando datos simulados en formato JSON...");

    const facturas = [
        {
            fecEmision: '05/12/2024',
            codTipoComprobante: '01',
            numSerie: 'F001',
            numComprobante: '0004567',
            numDocEmisor: '20100012341',
            nomRazonSocial: 'TIENDAS POR DEPARTAMENTO SA',
            mtoBaseImponibleGrav: 1512.71,
            mtoIgvIpm: 272.29,
            mtoTotalCP: 1785.00,
            codMoneda: 'PEN',
            mtoTipoCambio: 1
        },
        {
            fecEmision: '12/12/2024',
            codTipoComprobante: '01',
            numSerie: 'F005',
            numComprobante: '0000890',
            numDocEmisor: '20554433221',
            nomRazonSocial: 'CONSULTORA ABC EIRL',
            mtoBaseImponibleGrav: 2450.00,
            mtoIgvIpm: 441.00,
            mtoTotalCP: 2891.00,
            codMoneda: 'PEN',
            mtoTipoCambio: 1
        },
        {
            fecEmision: '20/12/2024',
            codTipoComprobante: '01',
            numSerie: 'F102',
            numComprobante: '0012345',
            numDocEmisor: '20601234567',
            nomRazonSocial: 'SERVICIOS LOGISTICOS XYZ',
            mtoBaseImponibleGrav: 1875.00,
            mtoIgvIpm: 337.50,
            mtoTotalCP: 2212.50,
            codMoneda: 'USD',
            mtoTipoCambio: 3.75
        },
        {
            fecEmision: '26/12/2024',
            codTipoComprobante: '01',
            numSerie: 'F008',
            numComprobante: '0007788',
            numDocEmisor: '20448899776',
            nomRazonSocial: 'INTERNET Y CABLE SA',
            mtoBaseImponibleGrav: 180.00,
            mtoIgvIpm: 32.40,
            mtoTotalCP: 212.40,
            codMoneda: 'PEN',
            mtoTipoCambio: 1
        }
    ];

    const record = {
        empresa_id,
        periodo,
        tipo_registro: 'COMPRAS',
        contenido_json: facturas,
        estado_sire: 'PROPUESTA (SIMULADA)',
        created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('registros_sire').insert([record]);

    if (error) {
        console.error("Error insertando datos:", error);
    } else {
        console.log("✅ Datos simulados cargados con éxito para CERDA PALOMINO YOVANA.");
    }
}

seedData();
