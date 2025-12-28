
import { supabase } from "@/lib/supabase/client";
import { ComprobanteSIRE } from "@/types/schema";

/**
 * Obtiene el Token de Acceso JWT de SUNAT a través de la Edge Function
 */
export async function obtenerTokenSunat(empresaId: string) {
    const { data, error } = await supabase.functions.invoke('auth-sunat', {
        body: { empresa_id: empresaId }
    });

    if (error) {
        console.error("Error obteniendo token SUNAT:", error);
        throw new Error(error.message || "No se pudo obtener el token de SUNAT");
    }

    return data.access_token;
}

/**
 * Descarga la propuesta de comprobantes de SUNAT SIRE
 */
export async function descargarPropuestaSire(token: string, ruc: string, periodo: string, tipo: 'compras' | 'ventas' = 'compras'): Promise<ComprobanteSIRE[]> {
    const { data, error } = await supabase.functions.invoke('sunat-sire-fetch', {
        body: { token, ruc, periodo, tipo }
    });

    if (error) {
        console.error("Error descargando propuesta SIRE:", error);
        throw new Error(error.message || "No se pudo descargar la propuesta de SUNAT");
    }

    // Mapear la respuesta de SUNAT a nuestro formato interno
    if (data && data.registros) {
        return data.registros.map((reg: any) => ({
            codCar: reg.codCar,
            fecEmision: reg.fecEmision,
            fecVcto: reg.fecVcto,
            codTipoComprobante: reg.codTipoComprobante,
            numSerie: reg.numSerie,
            numComprobante: reg.numComprobante,
            codTipoDocIdentidad: reg.codTipoDocIdentidad,
            numDocEmisor: reg.numDocEmisor,
            nomRazonSocial: reg.nomRazonSocial,
            mtoBaseImponibleGrav: parseFloat(reg.mtoBaseImponibleGrav || "0"),
            mtoIgvIpm: parseFloat(reg.mtoIgvIpm || "0"),
            mtoTotalCP: parseFloat(reg.mtoTotalCP || "0"),
            codMoneda: reg.codMoneda,
            mtoTipoCambio: parseFloat(reg.mtoTipoCambio || "1")
        }));
    }

    return [];
}

/**
 * Sincronización Completa: Token + Descarga + Guardado
 */
export async function sincronizarCompleto(empresaId: string, ruc: string, periodo: string) {
    try {
        const token = await obtenerTokenSunat(empresaId);
        const registros = await descargarPropuestaSire(token, ruc, periodo);

        // Guardar en la base de datos
        const { error } = await supabase.from('registros_sire').upsert({
            empresa_id: empresaId,
            periodo: periodo.replace(/-/g, ''),
            tipo_registro: 'COMPRAS',
            contenido_json: registros,
            estado_sire: 'PROPUESTA'
        });

        if (error) throw error;
        return registros;
    } catch (error) {
        throw error;
    }
}
