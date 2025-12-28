
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, LayoutDashboard, ChevronRight, FlaskConical } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { sincronizarCompleto } from "@/services/sunat/sunat-service";
import { generarZipSimuladoSire, procesarArchivoSireRealista } from "@/services/sunat/zip-simulator";
import { supabase } from "@/lib/supabase/client";

export function CompanyTable({ companies }: { companies: any[] }) {
    const [syncing, setSyncing] = useState<string | null>(null);

    const handleSync = async (empresa: any) => {
        setSyncing(empresa.id);
        try {
            const periodo = "202412"; // Diciembre 2024
            await sincronizarCompleto(empresa.id, empresa.ruc, periodo);
            toast.success(`Sincronización SIRE completada para ${empresa.razon_social}`);
        } catch (error: any) {
            toast.error(`Error sincronizando: ${error.message}`);
        } finally {
            setSyncing(null);
        }
    };

    const handleSimulate = async (empresa: any) => {
        setSyncing(empresa.id + '-sim');
        try {
            toast.info("Generando archivo ZIP simulado...");
            const zip = await generarZipSimuladoSire();
            const registros = await procesarArchivoSireRealista(zip);

            // Guardar en Supabase para ver los resultados en la tabla de detalle
            await supabase.from('registros_sire').upsert({
                empresa_id: empresa.id,
                periodo: "202412",
                tipo_registro: 'COMPRAS',
                contenido_json: registros,
                estado_sire: 'PROPUESTA (SIMULADA)'
            });

            toast.success(`Simulación exitosa: ${registros.length} facturas procesadas desde el ZIP.`);
        } catch (error: any) {
            toast.error(`Error en simulación: ${error.message}`);
        } finally {
            setSyncing(null);
        }
    };

    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Empresas Clientes</h3>
                <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
                    Periodo Activo: 202412
                </Badge>
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/30">
                        <TableHead>Razón Social / RUC</TableHead>
                        <TableHead>Estado SIRE</TableHead>
                        <TableHead className="text-right">IGV Ventas</TableHead>
                        <TableHead className="text-right">IGV Compras</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companies.map((empresa) => (
                        <TableRow key={empresa.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell>
                                <div className="font-medium text-slate-900">{empresa.razon_social}</div>
                                <div className="text-xs text-slate-500">{empresa.ruc}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-normal bg-emerald-50 text-emerald-700 border-emerald-100">
                                    Sincronizado
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono font-medium text-slate-900">S/ 4,200.00</TableCell>
                            <TableCell className="text-right font-mono font-medium text-emerald-600">S/ 2,150.00</TableCell>
                            <TableCell>
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSimulate(empresa)}
                                        disabled={syncing === empresa.id + '-sim'}
                                        className="h-8 border-amber-200 hover:border-amber-400 hover:text-amber-600 bg-amber-50"
                                    >
                                        <FlaskConical className={`h-3 w-3 mr-2 ${syncing === empresa.id + '-sim' ? 'animate-spin' : ''}`} />
                                        Simular ZIP
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSync(empresa)}
                                        disabled={syncing !== null}
                                        className="h-8 border-slate-200 hover:border-sky-400 hover:text-sky-600"
                                    >
                                        <RefreshCw className={`h-3 w-3 mr-2 ${syncing === empresa.id ? 'animate-spin' : ''}`} />
                                        SUNAT API
                                    </Button>
                                    <Link href={`/dashboard/${empresa.id}`}>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <LayoutDashboard className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
