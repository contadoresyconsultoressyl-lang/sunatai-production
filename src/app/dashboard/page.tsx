
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { CompanyTable } from "@/components/dashboard/company-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default async function DashboardPage() {
    // Fetch real companies from Supabase
    const { data: companies, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching companies:", error);
    }

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
                {companies && companies.length > 0 ? (
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
