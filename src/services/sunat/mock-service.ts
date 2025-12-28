
import { mockFacturas } from "@/lib/mock-data";

export async function obtenerTokenSunat(empresaId: string) {
    // Mock artificial delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "mock-jwt-token-" + empresaId;
}

export async function sincronizarPropuestaSire(ruc: string, periodo: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return mockFacturas;
}
