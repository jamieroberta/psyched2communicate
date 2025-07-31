import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Event Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'isVirtual',
      title: 'Virtual Event',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'meetingLink',
      title: 'Meeting Link',
      type: 'url',
      description: 'Link for virtual events',
      hidden: ({document}) => !document?.isVirtual,
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{type: 'region'}],
      description: 'Optional - leave empty for events with no specific region',
    }),
    defineField({
      name: 'category',
      title: 'Event Category',
      type: 'string',
      options: {
        list: [
          {title: 'Training', value: 'training'},
          {title: 'Workshop', value: 'workshop'},
          {title: 'Meeting', value: 'meeting'},
          {title: 'Conference', value: 'conference'},
          {title: 'Social', value: 'social'},
          {title: 'Other', value: 'other'},
        ],
      },
      initialValue: 'meeting',
    }),
    defineField({
      name: 'registrationRequired',
      title: 'Registration Required',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'registrationLink',
      title: 'Registration Link',
      type: 'url',
      hidden: ({document}) => !document?.registrationRequired,
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'region.name',
      media: 'image',
      startDate: 'startDate',
    },
    prepare(selection) {
      const {title, subtitle, media, startDate} = selection
      const dateStr = startDate ? new Date(startDate).toLocaleDateString() : ''
      return {
        title: title,
        subtitle: `${subtitle} • ${dateStr}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Start Date, Newest',
      name: 'startDateDesc',
      by: [
        {field: 'startDate', direction: 'desc'}
      ]
    },
    {
      title: 'Start Date, Oldest',
      name: 'startDateAsc',
      by: [
        {field: 'startDate', direction: 'asc'}
      ]
    },
  ],
})