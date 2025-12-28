"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { procesarArchivoSireRealista } from '@/services/sunat/zip-simulator';

export function UploadZipButton({ empresaId, onSuccess }: { empresaId: string, onSuccess?: () => void }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.zip')) {
            toast.error('Por favor selecciona un archivo ZIP');
            return;
        }

        setUploading(true);
        try {
            toast.info('Procesando archivo ZIP...');

            // Procesar el ZIP directamente (File es un Blob)
            const registros = await procesarArchivoSireRealista(file);

            if (registros.length === 0) {
                throw new Error('No se encontraron registros en el archivo ZIP');
            }

            // Guardar en Supabase
            const { error } = await supabase.from('registros_sire').upsert({
                empresa_id: empresaId,
                periodo: '202412', // Extraer del nombre del archivo si es posible
                tipo_registro: 'COMPRAS',
                contenido_json: registros,
                estado_sire: 'ARCHIVO_MANUAL'
            });

            if (error) throw error;

            toast.success(`✅ ZIP procesado: ${registros.length} comprobantes cargados`);

            // Limpiar input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Callback de éxito
            if (onSuccess) onSuccess();

        } catch (error: any) {
            console.error('Error procesando ZIP:', error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleUpload}
                className="hidden"
                id={`upload-zip-${empresaId}`}
            />
            <Button
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 border-blue-200 hover:border-blue-400 hover:text-blue-600 bg-blue-50"
            >
                <Upload className={`h-3 w-3 mr-2 ${uploading ? 'animate-spin' : ''}`} />
                {uploading ? 'Procesando...' : 'Subir ZIP'}
            </Button>
        </>
    );
}
