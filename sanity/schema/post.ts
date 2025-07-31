import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      name: 'type',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          {title: 'Job Posting', value: 'job'},
          {title: 'Event', value: 'event'},
          {title: 'Announcement', value: 'announcement'},
          {title: 'Resource', value: 'resource'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'externalLink',
      title: 'External Link',
      type: 'url',
      description: 'Link to apply for jobs, register for events, etc.',
    }),
    defineField({
      name: 'regions',
      title: 'Applicable Regions',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'region'}]}],
      validation: (Rule) => Rule.min(1).error('Must select at least one region'),
    }),
    defineField({
      name: 'datePosted',
      title: 'Date Posted',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date & Time',
      type: 'datetime',
      description: 'Only fill this out for events',
      hidden: ({document}) => document?.type !== 'event',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Show this post prominently on the homepage',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Date Posted, New',
      name: 'datePostedDesc',
      by: [{field: 'datePosted', direction: 'desc'}],
    },
    {
      title: 'Date Posted, Old',
      name: 'datePostedAsc',
      by: [{field: 'datePosted', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      date: 'datePosted',
    },
    prepare({title, subtitle, date}) {
      return {
        title,
        subtitle: `${subtitle} • ${new Date(date).toLocaleDateString()}`,
      }
    },
  },
})
