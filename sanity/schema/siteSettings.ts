import {defineField, defineType} from 'sanity'
import {simpleMediaField} from './mediaField'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    simpleMediaField('siteLogo', 'Site Logo', {
      description: 'Logo that appears in the top-left corner of the navigation bar. For best results, upload a square image (1:1 aspect ratio) at least 200x200 pixels, or your organization\'s brand document.',
      hotspot: true,
      required: true,
    }),
    defineField({
      name: 'homepageTitle',
      title: 'Homepage Title',
      type: 'string',
      description: 'Main title displayed on the homepage hero section',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'homepageSubtitle',
      title: 'Homepage Subtitle',
      type: 'text',
      description: 'Subtitle text displayed below the main title on the homepage',
      validation: (Rule) => Rule.required().max(300),
    }),
  ],
  preview: {
    select: {
      media: 'siteLogo',
    },
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration',
      }
    },
  },
})