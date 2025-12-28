# Diagnóstico Completo del Error 400/404 en auth-sunat

## 🔍 RESULTADOS DEL DIAGNÓSTICO:

### 1. ✅ Test de Edge Function (auth-sunat):
- **Status:** 400 Bad Request
- **Error:** La función está devolviendo HTML en lugar de JSON
- **Causa:** La función interna está fallando antes de poder responder correctamente

### 2. ⚠️ Test directo a SUNAT API:
- **Endpoint:** https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token/
- **Status:** 404 NotFound
- **Respuesta:** HTML (página de error)
- **Conclusión:** EL ENDPOINT NO EXISTE o no es accesible

## 🚨 PROBLEMA CRÍTICO IDENTIFICADO:

La URL del endpoint de OAuth2 de SUNAT parece estar incorrecta o el servicio no está disponible.

### Posibles causas:

1. **Endpoint incorrecto:**
   - Manual v28 indica: `https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token/`
   - Pero podría existir una versión alternativa sin la barra final
   - O el path podría ser diferente

2. **Entorno incorrecto:**
   - Producción: `api-seguridad.sunat.gob.pe`
   - Pruebas/Beta: Podría ser `api-test.sunat.gob.pe` o similar

3. **Servicio temporalmente no disponible:**
   - La SUNAT podría estar en mantenimiento
   - El servicio de OAuth2 podría estar caído

## 🔧 ACCIONES INMEDIATAS REQUERIDAS:

### Opción A: Verificar endpoint alternativo
Probar sin la barra final:
```
https://api-seguridad.sunat.gob.pe/v1/cliententidad/oauth2/token
```

### Opción B: Verificar documentación actualizada
- Consultar el Manual SIRE v28 actualizado
- Verificar si hay un nuevo endpoint para 2025

### Opción C: Contactar soporte SUNAT
- El 404 sugiere que el endpoint cambió o no está habilitado
- Necesitas confirmar con SUNAT cuál es el endpoint correcto

### Opción D: Usar modo simulación
- Mientras se resuelve esto, cargar datos mediante el simulador ZIP
- Ya cargamos datos simulados para CERDA PALOMINO YOVANA que están funcionando

## 📋 VERIFICACIÓN DE SECRETS:

**Pendiente:** No se pudo acceder al dashboard de Supabase por límite de tasa.

Para verificar manualmente:
1. Ve a: https://supabase.com/dashboard/project/isbnoiviaskdatvrpgka/settings/vault
2. Confirma que existen:
   - `SUNAT_CLIENT_ID`: 32f16daf-2772-4c3e-8a9a-cb831efca40d
   - `SUNAT_CLIENT_SECRET`: Yt6vbm1y19CeYLsXiR1RZg==
   - `ENCRYPTION_KEY`: SUNAT_AI_SECURE_KEY_32_CHARS_V28

## 💡 RECOMENDACIÓN INMEDIATA:

**1. Probar endpoint sin barra final**
**2. Revisar si el portal SOL muestra alguna URL de endpoint en la configuración de tu aplicación**
**3. Mientras tanto, usar el sistema con datos simulados que ya funcionan**

