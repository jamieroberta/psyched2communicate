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
      description: 'Logo that appears in the top-left corner of the navigation bar. For best results, upload a square image (1:1 aspect ratio) at least 200x200 pixels.',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
      validation: (Rule) => Rule.required().custom((image) => {
        // Note: We can't validate aspect ratio in Sanity validation,
        // but the description guides users to upload square images
        return true
      }),
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