import {defineField, defineType} from 'sanity'

// Matches the fields queried in pages/index.tsx and pages/projects/index.tsx
export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'detail', title: 'Detail', type: 'text'}),
    defineField({name: 'link', title: 'Link', type: 'url'}),
  ],
  preview: {select: {title: 'title', media: 'image'}},
})
