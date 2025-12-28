"use client";

export default function ConfigPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configuración</h1>
                <p className="text-slate-500 text-lg">Preferencias y ajustes del sistema</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-600 mb-4">Módulo de configuración en desarrollo</p>
                <p className="text-sm text-slate-400">Funcionalidades: Perfil, Notificaciones, API Keys</p>
            </div>
        </div>
    );
}
