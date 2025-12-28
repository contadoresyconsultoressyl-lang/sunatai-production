
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Users } from "lucide-react";

export function StatsOverview() {
    const stats = [
        { title: "Clientes Activos", value: "12", icon: Users, color: "text-blue-600" },
        { title: "Ventas Mes (PEN)", value: "S/ 145,200", icon: TrendingUp, color: "text-emerald-600" },
        { title: "Compras Mes (PEN)", value: "S/ 82,400", icon: TrendingDown, color: "text-rose-600" },
        { title: "IGV por Liquidar", value: "S/ 11,304", icon: Wallet, color: "text-amber-600" },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow cursor-default border-none shadow-sm bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
