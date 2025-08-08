import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'region',
  title: 'Region',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Region Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'logo',
      title: 'Region Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'officeHoursInfo',
      title: 'Office Hours Information',
      type: 'text',
      description: 'Describe office hours or include scheduling links',
      rows: 3,
    }),
    defineField({
      name: 'schedulingLink',
      title: 'Scheduling Link',
      type: 'url',
      description: 'External link for scheduling appointments',
    }),
    defineField({
      name: 'websiteLink',
      title: 'Website Link',
      type: 'url',
      description: 'Link to the region\'s official website',
    }),
    defineField({
      name: 'color',
      title: 'Region Color',
      type: 'string',
      description: 'Color for region events on calendar (hex code)',
      validation: (Rule) => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Must be a valid hex color'),
      initialValue: '#3B82F6',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
