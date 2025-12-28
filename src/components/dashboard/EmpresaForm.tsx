
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { empresaSchema, EmpresaFormValues } from "@/types/schema";
import { encryptData } from "@/lib/crypto/encryption";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Building2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function EmpresaForm() {
    const router = useRouter();
    const form = useForm<EmpresaFormValues>({
        resolver: zodResolver(empresaSchema),
        defaultValues: { ruc: "", razonSocial: "", usuarioSol: "", claveSol: "" },
    });

    async function onSubmit(values: EmpresaFormValues) {
        try {
            // 1. Encriptar credenciales SOL antes de salir del navegador
            const encryptedUser = await encryptData(values.usuarioSol);
            const encryptedPass = await encryptData(values.claveSol);

            // 2. Guardar en Supabase
            // NOTA: Para pruebas rápidas sin auth, estamos omitiendo el contador_id o usando uno dummy
            const { data: userData } = await supabase.auth.getUser();

            const { error } = await supabase.from('empresas').insert({
                ruc: values.ruc,
                razon_social: values.razonSocial,
                sunat_usuario_sol: encryptedUser,
                sunat_clave_sol: encryptedPass,
                contador_id: userData?.user?.id || '00000000-0000-0000-0000-000000000000' // UUID dummy para pruebas si no hay login
            });

            if (error) throw error;

            toast.success("Empresa registrada correctamente y credenciales protegidas.");
            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error("Error al registrar: " + error.message);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto shadow-xl border-t-4 border-t-slate-900 border-none">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Building2 className="text-slate-900 w-6 h-6" />
                    <CardTitle>Vincular Nueva Empresa</CardTitle>
                </div>
                <CardDescription>Conecta el RUC del cliente para sincronizar con SIRE SUNAT</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ruc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>RUC</FormLabel>
                                        <FormControl><Input placeholder="20123456789" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="razonSocial"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Razón Social</FormLabel>
                                        <FormControl><Input placeholder="MI CLIENTE SAC" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
                                <Lock className="w-4 h-4" /> CREDENCIALES SOL (SEGURAS)
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="usuarioSol"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Usuario SOL</FormLabel>
                                            <FormControl><Input placeholder="MODDATOS" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="claveSol"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Clave SOL</FormLabel>
                                            <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link href="/dashboard" className="flex-1">
                                <Button variant="outline" type="button" className="w-full">Cancelar</Button>
                            </Link>
                            <Button type="submit" className="flex-1 bg-slate-900 flex gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Registrar y Proteger
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
