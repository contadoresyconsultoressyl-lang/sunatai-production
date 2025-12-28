"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

// Lazy load CompanyTable para mejorar tiempo de carga inicial
const CompanyTable = dynamic(() => import("@/components/dashboard/company-table").then(mod => ({ default: mod.CompanyTable })), {
    loading: () => <TableSkeleton />,
    ssr: false
});

function TableSkeleton() {
    return (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden animate-pulse">
            <div className="p-4 border-b bg-slate-50/50 h-14"></div>
            <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-100 rounded"></div>
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCompanies() {
            const { data, error } = await supabase
                .from('empresas')
                .select('id, ruc, razon_social, created_at')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                console.error("Error fetching companies:", error);
            } else {
                setCompanies(data || []);
            }
            setLoading(false);
        }
        fetchCompanies();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Panel Contable</h1>
                    <p className="text-slate-500 text-lg">Bienvenido al centro de mando de SunatAI.</p>
                </div>
                <Link href="/dashboard/nueva-empresa">
                    <Button className="bg-slate-900 shadow-lg shadow-slate-900/20 hover:bg-slate-800">
                        <Plus className="mr-2 h-4 w-4" /> Nueva Empresa
                    </Button>
                </Link>
            </div>

            <StatsOverview />

            <div className="space-y-4">
                {loading ? (
                    <TableSkeleton />
                ) : companies && companies.length > 0 ? (
                    <CompanyTable companies={companies} />
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No tienes empresas registradas.</p>
                        <Link href="/dashboard/nueva-empresa">
                            <Button variant="link" className="text-sky-600">Registra tu primera empresa aquí</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
