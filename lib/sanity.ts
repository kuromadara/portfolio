import { createClient, type SanityClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

/** `null` when NEXT_PUBLIC_SANITY_PROJECT_ID isn't set (e.g. local dev without .env.local). */
export const sanity: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'projects',
      useCdn: process.env.NODE_ENV === 'production',
      apiVersion: '2024-08-01',
    })
  : null

export interface Project {
  _id: string
  title: string
  description: string | null
  detail: string | null
  link: string | null
  image: string | null
}

/** Fields match studio/schemaTypes/project.ts */
export async function getProjects(): Promise<Project[]> {
  if (!sanity) {
    console.warn('[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID not set — skipping projects')
    return []
  }
  try {
    return await sanity.fetch<Project[]>(
      `*[_type == "project"] | order(_createdAt desc) {
        _id, title, description, detail, link, "image": image.asset->url
      }`,
    )
  } catch (err) {
    console.error('[sanity] failed to fetch projects:', err)
    return []
  }
}
