
import { ComprobanteSIRE } from "@/types/schema";

export const mockFacturas: ComprobanteSIRE[] = [
    {
        codCar: "2024110001",
        fecEmision: "2024-11-02",
        codTipoComprobante: "01",
        numSerie: "F001",
        numComprobante: "452",
        codTipoDocIdentidad: "6",
        numDocEmisor: "20556677889",
        nomRazonSocial: "PROVEEDOR A SAC",
        mtoBaseImponibleGrav: 1000,
        mtoIgvIpm: 180,
        mtoTotalCP: 1180,
        codMoneda: "PEN"
    },
    {
        codCar: "2024110002",
        fecEmision: "2024-11-05",
        codTipoComprobante: "01",
        numSerie: "E001",
        numComprobante: "89",
        codTipoDocIdentidad: "6",
        numDocEmisor: "20112233445",
        nomRazonSocial: "SERVICIOS LOGISTICOS SAC",
        mtoBaseImponibleGrav: 2500,
        mtoIgvIpm: 450,
        mtoTotalCP: 2950,
        codMoneda: "PEN",
        esRiesgoso: true,
        estadoRuc: "ACTIVO",
        condicionRuc: "NO HABIDO"
    },
    {
        codCar: "2024110003",
        fecEmision: "2024-11-10",
        codTipoComprobante: "01",
        numSerie: "F002",
        numComprobante: "1234",
        codTipoDocIdentidad: "6",
        numDocEmisor: "20334455667",
        nomRazonSocial: "MATERIALES PERU SRL",
        mtoBaseImponibleGrav: 500,
        mtoIgvIpm: 90,
        mtoTotalCP: 590,
        codMoneda: "PEN"
    }
];

export const mockEmpresas = [
    { id: "1", ruc: "20123456789", razon_social: "IMPORTACIONES PERÚ SAC" },
    { id: "2", ruc: "20987654321", razon_social: "LOGÍSTICA DEL SUR SRL" },
];
