import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schema'

const projectId = 'h3prmcr9'
const dataset = 'production'

export default defineConfig({
  name: 'slpc-consultants',
  title: 'SLPC Consultants CMS',
  
  projectId,
  dataset,
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Resources')
              .child(S.documentTypeList('resource').title('Resources')),
            S.listItem()
              .title('Regions')
              .child(S.documentTypeList('region').title('Regions')),
            S.listItem()
              .title('Consultants')
              .child(S.documentTypeList('consultant').title('Consultants')),
            S.listItem()
              .title('Events')
              .child(S.documentTypeList('event').title('Events')),
            S.listItem()
              .title('Announcements')
              .child(S.documentTypeList('announcement').title('Announcements')),
            S.listItem()
              .title('Posts')
              .child(S.documentTypeList('post').title('Posts')),
            S.listItem()
              .title('Pages')
              .child(S.documentTypeList('page').title('Pages')),
          ])
    }),
    visionTool(),
  ],
  
  schema: {
    types: schemaTypes,
  },
})
