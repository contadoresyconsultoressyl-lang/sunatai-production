
import { EmpresaForm } from "@/components/dashboard/EmpresaForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NuevaEmpresaPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Configuración de Nuevo Cliente</h1>
            </div>

            <EmpresaForm />
        </div>
    );
}
