import {defineField, defineType} from 'sanity'

// Custom media field that accepts both images and PDFs
export const mediaField = (name: string, title: string, options: {
  description?: string
  required?: boolean
  hotspot?: boolean
} = {}) => {
  return defineField({
    name,
    title,
    type: 'object',
    description: options.description || 'Upload an image or PDF document',
    fields: [
      defineField({
        name: 'mediaType',
        title: 'Media Type',
        type: 'string',
        options: {
          list: [
            { title: 'Image', value: 'image' },
            { title: 'PDF Document', value: 'pdf' },
          ],
        },
        initialValue: 'image',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: options.hotspot !== false,
          accept: 'image/*',
        },
        hidden: ({ parent }) => parent?.mediaType !== 'image',
        validation: (Rule) => 
          Rule.custom((value, context) => {
            if (context?.parent?.mediaType === 'image' && options.required && !value) {
              return 'Image is required when media type is Image'
            }
            return true
          }),
      }),
      defineField({
        name: 'pdf',
        title: 'PDF Document',
        type: 'file',
        options: {
          accept: '.pdf',
        },
        hidden: ({ parent }) => parent?.mediaType !== 'pdf',
        validation: (Rule) => 
          Rule.custom((value, context) => {
            if (context?.parent?.mediaType === 'pdf' && options.required && !value) {
              return 'PDF file is required when media type is PDF Document'
            }
            return true
          }),
      }),
      defineField({
        name: 'alt',
        title: 'Alt Text / Description',
        type: 'string',
        description: 'Alternative text for images or description for PDFs (for accessibility)',
        validation: (Rule) => 
          Rule.custom((value, context) => {
            if (context?.parent?.mediaType === 'image' && !value) {
              return 'Alt text is required for images (accessibility)'
            }
            return true
          }),
      }),
    ],
    preview: {
      select: {
        mediaType: 'mediaType',
        image: 'image',
        pdf: 'pdf.asset.originalFilename',
        alt: 'alt',
      },
      prepare({ mediaType, image, pdf, alt }) {
        return {
          title: alt || 'Media',
          subtitle: mediaType === 'image' ? '🖼️ Image' : `📄 PDF: ${pdf || 'Uploaded'}`,
          media: mediaType === 'image' ? image : undefined,
        }
      },
    },
    validation: options.required ? (Rule) => Rule.required() : undefined,
  })
}

// Alternative: Simpler union type approach
export const simpleMediaField = (name: string, title: string, options: {
  description?: string
  required?: boolean
  hotspot?: boolean
} = {}) => {
  return defineField({
    name,
    title,
    type: 'array',
    description: options.description || 'Upload an image or PDF document',
    of: [
      {
        type: 'image',
        title: 'Image',
        options: {
          hotspot: options.hotspot !== false,
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alt Text',
            description: 'Alternative text for accessibility',
            validation: (Rule: any) => Rule.required(),
          },
        ],
      },
      {
        type: 'file',
        title: 'PDF Document',
        options: {
          accept: '.pdf',
        },
        fields: [
          {
            name: 'description',
            type: 'string',
            title: 'Description',
            description: 'Brief description of the document',
          },
        ],
      },
    ],
    validation: options.required 
      ? (Rule) => Rule.required().min(1).max(1).error('Please upload exactly one file')
      : (Rule) => Rule.max(1).error('Please upload only one file'),
  })
}
