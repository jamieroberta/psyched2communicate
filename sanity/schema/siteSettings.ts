import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteLogo',
      title: 'Site Logo',
      type: 'image',
      description: 'Logo that appears in the top-left corner of the navigation bar',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
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