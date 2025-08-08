import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'consultant',
  title: 'Consultant',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Consultant\'s full name',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      description: 'Consultant\'s job title or position',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'image',
      title: 'Profile Photo',
      type: 'image',
      description: 'Professional headshot or profile photo',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'email',
      description: 'Primary contact email address',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Primary contact phone number',
      validation: (Rule) => Rule.required().max(20),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      description: 'The region this consultant serves',
      weak: false,
      options: {
        filter: '_type == "region"',
        filterParams: {},
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this consultant should be displayed',
      initialValue: true,
    }),
    defineField({
      name: 'schedulingLink',
      title: 'Scheduling Link',
      type: 'url',
      description: 'External link for scheduling appointments with this consultant (e.g. Calendly, Acuity)',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this consultant appears (lower numbers appear first)',
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'name',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Region',
      name: 'region',
      by: [{ field: 'region.name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'image',
      regionName: 'region.name',
      isActive: 'isActive',
    },
    prepare({ title, subtitle, media, regionName, isActive }) {
      return {
        title: title,
        subtitle: `${subtitle} • ${regionName || 'No region'} ${isActive ? '' : '(Inactive)'}`,
        media,
      }
    },
  },
})