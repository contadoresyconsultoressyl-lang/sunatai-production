
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, ChevronLeft, Calendar, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { ComprobanteSIRE } from "@/types/schema";

export default async function EmpresaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch real records from Supabase
    const { data: registro } = await supabase
        .from('registros_sire')
        .select('*')
        .eq('empresa_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    const facturas: ComprobanteSIRE[] = registro?.contenido_json || [];

    // Calcular totales
    const totalBase = facturas.reduce((acc, f) => acc + (f.mtoBaseImponibleGrav || 0), 0);
    const totalIgv = facturas.reduce((acc, f) => acc + (f.mtoIgvIpm || 0), 0);
    const totalGeneral = facturas.reduce((acc, f) => acc + (f.mtoTotalCP || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registro de Compras - SIRE</h1>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>Periodo: <span className="font-semibold text-slate-700">{registro?.periodo || "N/A"}</span></span>
                            <span className="mx-2">•</span>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                                {registro?.estado_sire || "SINCERAR"}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-10 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all">
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Exportar Formato 8.1
                    </Button>
                    <Button size="sm" className="bg-slate-900 h-10 shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
                        <Download className="mr-2 h-4 w-4" /> Bajar TXT SUNAT
                    </Button>
                </div>
            </div>

            {/* Resumen de Totales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Base Imponible</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">S/ {totalBase.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total IGV</p>
                    <p className="text-xl font-bold text-sky-600 mt-1">S/ {totalIgv.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Precio Total</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">S/ {totalGeneral.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {facturas.length > 0 ? (
                    <Table>
                        <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                            <TableRow>
                                <TableHead className="w-[110px]">Fecha</TableHead>
                                <TableHead className="w-[120px]">Documento</TableHead>
                                <TableHead>Proveedor</TableHead>
                                <TableHead className="text-center">Moneda</TableHead>
                                <TableHead className="text-center">T.C.</TableHead>
                                <TableHead className="text-right">Base Imp.</TableHead>
                                <TableHead className="text-right">IGV</TableHead>
                                <TableHead className="text-right font-bold text-slate-900">Total</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facturas.map((f, i) => (
                                <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="text-slate-600 py-3">{f.fecEmision}</TableCell>
                                    <TableCell className="font-medium text-slate-900">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 font-normal">{f.codTipoComprobante === '01' ? 'Factura' : 'Boleta'}</span>
                                            {f.numSerie}-{f.numComprobante}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-800 line-clamp-1">{f.nomRazonSocial}</span>
                                            <span className="text-xs text-slate-500">{f.numDocEmisor}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={f.codMoneda === 'PEN' ? 'border-slate-200' : 'border-amber-200 bg-amber-50 text-amber-700'}>
                                            {f.codMoneda}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-mono text-xs text-slate-500">
                                        {f.mtoTipoCambio && f.mtoTipoCambio > 1 ? f.mtoTipoCambio.toFixed(3) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-slate-600">
                                        {f.mtoBaseImponibleGrav.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sky-600">
                                        {f.mtoIgvIpm.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold text-slate-900">
                                        {f.mtoTotalCP.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-medium">
                                            Activo
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-32 text-center">
                        <Coins className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-slate-900 font-semibold text-lg">Sin comprobantes</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">No hay datos sincronizados para esta empresa en el periodo seleccionado.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
