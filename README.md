# Actualizacion de datos

Aplicacion web para una campana de actualizacion de datos de clientes. Incluye
panel administrativo, gestores con URL unica, asignacion balanceada, importacion
Excel con SheetJS y exportacion CSV/XLSX.

## Estado actual

- Base real cargada desde `Clientes_Micro_OFICIAL.xlsx`, hoja visible `Hoja3`.
- 389 clientes activos.
- 19 gestores activos: `Gestor 1` a `Gestor 19`.
- URLs de trabajo: `/trabajo/gestor-1` a `/trabajo/gestor-19`.
- El panel administrativo permite editar el nombre de los gestores sin cambiar
  su URL de acceso.

## Configuracion local

1. Copia `.env.example` a `.env.local`.
2. Completa las variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
ADMIN_ACCESS_KEY=ACTUALIZA-ADMIN-2026
```

3. Instala dependencias y ejecuta:

```bash
npm ci
npm run dev
```

Sin variables de Supabase, la app usa datos demo en `localStorage` para poder
probar el flujo completo. Con Supabase configurado, lee y escribe en las tablas
por REST usando la anon key.

## Deployment publico en Netlify

El proyecto esta preparado para Next.js estandar en Netlify.

Build settings:

```bash
Build command: npm run build
Publish directory: .next
Node version: 22
```

El archivo `netlify.toml` ya contiene esos valores.

Variables de entorno en Netlify:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
ADMIN_ACCESS_KEY
```

Usa `ADMIN_ACCESS_KEY` para el panel administrativo. No uses
`NEXT_PUBLIC_ADMIN_ACCESS_KEY` en produccion porque cualquier variable
`NEXT_PUBLIC_*` queda visible en el navegador.

## Base de datos

Ejecuta en Supabase SQL Editor:

1. `supabase/001_schema.sql`
2. `supabase/002_seed_demo.sql` solo si necesitas datos demo

Para produccion, la base real ya fue cargada desde `Hoja3` con 389 registros.

## Excel real esperado

La importacion acepta `.xlsx`, `.xls` o `.csv`. El importador usa la primera hoja
visible del libro y reconoce las columnas reales de `Hoja3`:

- `Suscriptor`
- `Código de cliente / CLI`
- `Razón social`
- `Razón comercial`
- `Contrato / descripción`
- `Teléfono 1`
- `Teléfono 2`
- `Contactos`
- `Correo`
- `Fecha vence soporte`
- `Distribuidor`
- `Tipo de contrato`
- `Licencias Light`
- `Licencias Estándar`
- `Licencias ERP`
- `Licencias Rutas`
- `Total de licencias`

## Seguridad antes de abrir al publico

La app ya no depende del login de ChatGPT y puede correr en Netlify. Para un
sitio publico real, revisa las politicas RLS de Supabase antes de compartir la
URL ampliamente. El prototipo usa acceso REST desde navegador con anon key, asi
que las politicas de Supabase deben limitar exactamente que puede leer/escribir
cada rol.

Recomendacion para endurecer produccion:

- Cerrar las politicas prototipo `using (true)` en Supabase.
- Usar endpoints server-side para operaciones administrativas.
- Mantener `SUPABASE_SERVICE_ROLE_KEY` solo como variable secreta del servidor.
- No exponer listados de gestores ni claves en pantallas publicas.
