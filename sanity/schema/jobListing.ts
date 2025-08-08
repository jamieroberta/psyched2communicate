import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'jobListing',
  title: 'Job Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      description: 'The title of the job position',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Job Description',
      type: 'text',
      description: 'Detailed description of the job position and requirements',
      validation: (Rule) => Rule.required().max(2000),
      rows: 6,
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      description: 'The region where this job is located',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'applicationLink',
      title: 'Application Link',
      type: 'url',
      description: 'Link to the job application or posting',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postedDate',
      title: 'Posted Date',
      type: 'date',
      description: 'When this job was posted',
      validation: (Rule) => Rule.required(),
      initialValue: new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this job listing should be displayed',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Posted Date (Newest First)',
      name: 'postedDate',
      by: [{ field: 'postedDate', direction: 'desc' }],
    },
    {
      title: 'Job Title',
      name: 'title',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      regionName: 'region.name',
      isActive: 'isActive',
      postedDate: 'postedDate',
    },
    prepare({ title, regionName, isActive, postedDate }) {
      const date = new Date(postedDate).toLocaleDateString()
      const status = isActive ? '🟢 Active' : '🔴 Inactive'
      
      return {
        title: title,
        subtitle: `${regionName || 'No region'} • ${date} • ${status}`,
      }
    },
  },
})
