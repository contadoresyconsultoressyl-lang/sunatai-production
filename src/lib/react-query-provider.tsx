"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutos - datos se consideran "frescos"
                gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché
                refetchOnWindowFocus: false, // No refetch al enfocar ventana
                refetchOnReconnect: true, // Sí refetch al reconectar
                retry: 1, // Reintentar 1 vez en caso de error
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
