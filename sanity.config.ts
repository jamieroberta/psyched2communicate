import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schema'

export default defineConfig({
  name: 'slpc-consultants',
  title: 'SLPC Consultants CMS',
  
  projectId: 'h3prmcr9',
  dataset: 'production',
  
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
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
