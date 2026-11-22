'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes, SINGLETONS } from './sanity/schemas'

export default defineConfig({
  name: 'innovoo',
  title: 'Innovoo — Sitio web',
  basePath: '/studio',
  projectId: projectId || 'configura-tu-project-id',
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (input, { schemaType }) =>
      SINGLETONS.includes(schemaType) ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : input,
  },
  plugins: [
    structureTool({
      title: 'Contenido',
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem().title('Ajustes del sitio').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem().title('Página de inicio').id('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            S.documentTypeListItem('division').title('Divisiones'),
            S.listItem()
              .title('Catálogo de servicios')
              .child(
                S.list()
                  .title('Catálogo por división')
                  .items([
                    ['core-services', 'Core Services'],
                    ['data-ai', 'Data & AI'],
                    ['growth-marketing', 'Growth Marketing'],
                  ].map(([value, title]) =>
                    S.listItem().title(title).child(
                      S.documentList().title(title).schemaType('service').filter('_type == "service" && division == $d').params({ d: value }).defaultOrdering([{ field: 'order', direction: 'asc' }]),
                    ),
                  ).concat([S.listItem().title('Todos los servicios').child(S.documentTypeList('service'))])),
              ),
            S.documentTypeListItem('caseStudy').title('Casos de éxito'),
            S.documentTypeListItem('assessment').title('Evaluaciones'),
            S.documentTypeListItem('article').title('Artículos'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
