# Innovoo — Sitio web con CMS

Sitio de **innovoo.ai** construido con **Next.js** y **Sanity CMS**. Marketing edita textos, casos, catálogo, evaluaciones y artículos desde `innovoo.ai/studio`, sin tocar código.

Mientras Sanity no esté configurado, el sitio funciona igual con el contenido de `content/seed.json`.

## Qué incluye

| Página | Ruta |
|---|---|
| Inicio (hero 3D, casos de uso de IA, calculadora de ROI, casos, FAQ) | `/` |
| Catálogos comerciales con buscador, filtros y armador de propuesta | `/servicios/core-services`, `/servicios/data-ai`, `/servicios/growth-marketing` |
| Centro de evaluaciones (4 diagnósticos con puntaje y plan recomendado) | `/evaluaciones` |
| Nosotros y Contacto | `/nosotros`, `/contacto` |
| Panel de edición (Sanity Studio) | `/studio` |
| Endpoint de formularios → n8n | `/api/lead` |

## 1. Correr en local

```bash
npm install
cp .env.example .env.local   # completa las variables
npm run dev                  # http://localhost:3000
```

## 2. Configurar Sanity (una sola vez)

1. Crea una cuenta y un proyecto en <https://www.sanity.io/manage> (el plan gratuito alcanza para empezar). Dataset: `production`.
2. Copia el **Project ID** en `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. En **API → CORS origins**, agrega `http://localhost:3000` y `https://innovoo.ai` (marca *Allow credentials*).
4. En **API → Tokens**, crea un token con permiso **Editor** y ponlo en `SANITY_API_WRITE_TOKEN`.
5. Carga el contenido actual del sitio:

```bash
npm run seed
```

6. Entra a `http://localhost:3000/studio`, inicia sesión con tu cuenta de Sanity y ya puedes editar.
7. Invita a tu equipo desde <https://www.sanity.io/manage> → *Members*.

> El token de escritura solo se usa para `npm run seed`. **No** lo agregues en Netlify.

## 3. Publicar en Netlify

1. En Netlify: *Add new site → Import an existing project* y elige este repositorio. Netlify detecta Next.js automáticamente (`netlify.toml` ya está listo).
2. En *Site configuration → Environment variables* agrega:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2025-01-01`
   - `N8N_LEAD_WEBHOOK_URL` (webhook de n8n para los formularios)
   - `NEXT_PUBLIC_SITE_URL` = `https://innovoo.ai`
3. Despliega y conecta el dominio `innovoo.ai` en *Domain management*.

Los cambios publicados en Sanity aparecen en el sitio en un máximo de 60 segundos.

## 4. Formularios → n8n

Contacto, evaluaciones y newsletter envían un `POST` a `/api/lead`, que lo reenvía a `N8N_LEAD_WEBHOOK_URL` con este formato:

```json
{
  "type": "contacto | evaluacion | newsletter",
  "data": { "nombre": "…", "email": "…", "empresa": "…" },
  "page": "/contacto",
  "receivedAt": "2026-11-22T03:00:00.000Z",
  "source": "innovoo.ai"
}
```

En n8n crea un flujo con un nodo **Webhook (POST)** y desde ahí envíalo al ARM, Slack o correo.

## Estructura

```
app/(site)/        páginas públicas
app/studio/        Sanity Studio embebido
app/api/lead/      endpoint de formularios
components/        Header, Footer, escenas 3D, catálogo, evaluaciones, etc.
components/scene-engine.js   motor de escenas 3D (Three.js)
content/seed.json  contenido inicial / respaldo sin Sanity
lib/content.ts     lectura de contenido (Sanity o seed)
sanity/schemas/    modelo de contenido del CMS
scripts/seed-sanity.mjs      carga el contenido inicial en Sanity
```

## Qué se edita en el CMS y qué no

- **Editable en `/studio`:** ajustes y contacto, textos y cifras del inicio, casos de uso de IA, tareas de la calculadora de ROI, industrias, FAQ, divisiones, los 29 servicios del catálogo, casos de éxito con métricas, preguntas de las evaluaciones y artículos.
- **En código:** diseño, escenas 3D, lógica de puntajes y de la calculadora.
