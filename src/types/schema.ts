
import * as z from "zod";

export const empresaSchema = z.object({
    ruc: z.string().length(11, "El RUC debe tener 11 dígitos").regex(/^\d+$/, "Solo números"),
    razonSocial: z.string().min(3, "Razón social demasiado corta"),
    usuarioSol: z.string().min(4, "Usuario SOL requerido"),
    claveSol: z.string().min(4, "Clave SOL requerida"),
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;

export interface ComprobanteSIRE {
    codCar?: string;
    fecEmision: string;
    fecVcto?: string;
    codTipoComprobante: string;
    numSerie: string;
    numComprobante: string;
    codTipoDocIdentidad: string;
    numDocEmisor: string;
    nomRazonSocial: string;
    mtoBaseImponibleGrav: number;
    mtoIgvIpm: number;
    mtoTotalCP: number;
    codMoneda: string;
    mtoTipoCambio?: number;
    esRiesgoso?: boolean;
    estadoRuc?: string;
    condicionRuc?: string;
}
