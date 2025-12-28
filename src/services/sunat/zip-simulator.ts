
import JSZip from "jszip";
import { ComprobanteSIRE } from "@/types/schema";

/**
 * Crea un ZIP falso que contiene un TXT con formato SIRE SUNAT (v28)
 * Columnas principales separadas por '|'
 */
export async function generarZipSimuladoSire(): Promise<Blob> {
    const zip = new JSZip();

    // Formato: CAR|FECHA|FECHA_V|TIPO|SERIE|NUMERO|...|RUC_EMISOR|RAZON_SOCIAL|...|BASE|IGV|TOTAL
    const lineas = [
        "202411000001|05/11/2024||01|F001|1|6|20100011122|EMPRESA DE PRUEBA SAC||||1000.00|0.00|180.00|0.00|0.00|0.00|0.00|0.00|0.00|1180.00|PEN|3.75|||||||",
        "202411000002|10/11/2024||01|E001|45|6|20556677889|PROVEEDOR LOGISTICO SRL||||2500.00|0.00|450.00|0.00|0.00|0.00|0.00|0.00|0.00|2950.00|PEN|3.75|||||||",
        "202411000003|15/11/2024||01|F002|999|6|20223344556|GLOBAL SOLUTIONS SAC||||500.00|0.00|90.00|0.00|0.00|0.00|0.00|0.00|0.00|590.00|PEN|3.75|||||||"
    ].join("\n");

    zip.file("LE2060000000020241100080100001111.txt", lineas);
    return await zip.generateAsync({ type: "blob" });
}

/**
 * Parser realista para el TXT del SIRE (Manual v28)
 */
export async function procesarArchivoSireRealista(zipBlob: Blob): Promise<ComprobanteSIRE[]> {
    const zip = new JSZip();
    const content = await zip.loadAsync(zipBlob);
    const txtFile = Object.values(content.files).find(f => f.name.endsWith('.txt'));

    if (!txtFile) throw new Error("No se encontró el archivo TXT en el ZIP");

    const text = await txtFile.async("text");
    const lineas = text.split("\n").filter(l => l.trim().length > 0);

    return lineas.map(linea => {
        const c = linea.split("|");
        return {
            codCar: c[0],
            fecEmision: c[1],
            codTipoComprobante: c[3],
            numSerie: c[4],
            numComprobante: c[5],
            codTipoDocIdentidad: c[6],
            numDocEmisor: c[7],
            nomRazonSocial: c[8],
            mtoBaseImponibleGrav: parseFloat(c[12] || "0"),
            mtoIgvIpm: parseFloat(c[14] || "0"),
            mtoTotalCP: parseFloat(c[21] || "0"),
            codMoneda: c[22],
            mtoTipoCambio: parseFloat(c[23] || "1")
        };
    });
}
