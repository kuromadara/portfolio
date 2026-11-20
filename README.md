# Portfolio

Personal portfolio site built with Next.js (Pages Router) and Tailwind CSS. Project content is managed in [Sanity](https://www.sanity.io), a hosted headless CMS. There is no custom backend: the site fetches content straight from Sanity's API.

```
portfolio/
├── pages/, Components/, lib/   Next.js site
│   └── lib/sanity.js           Sanity client used by the site
└── studio/                     Sanity Studio (content editor), separate npm project
    └── schemaTypes/project.ts  Shape of a "project" document
```

- **Sanity project ID:** `qw7500aq`
- **Dataset:** `projects`
- **Hosted Studio:** <https://dayaportfolioback.sanity.studio/>

## Requirements

- Node.js 18 or later
- A Sanity account with access to project `qw7500aq` (only needed for the Studio)

## Running the site

1. Create `.env.local` in the repo root:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=qw7500aq
   NEXT_PUBLIC_SANITY_DATASET=projects
   ```

   To run `npm run sync:travel` you also need a `SANITY_WRITE_TOKEN` variable in this file. Create an Editor token at sanity.io/manage → API → Tokens. Never commit it or paste it into docs; `.env.local` is gitignored.

2. Install and start:

   ```bash
   npm install
   npm run dev        # http://localhost:3000
   ```

Other scripts: `npm run build` (production build) and `npm start` (serve the build).

On Vercel, set the two `NEXT_PUBLIC_…` variables under **Project → Settings → Environment Variables**. Vercel builds from the repo root and ignores `studio/`.

## Travel data (Polarsteps)

The `/travel` pages never call Polarsteps at runtime. They read a committed snapshot, `content/travel.json`, written by:

```bash
npm run sync:travel
```

The sync fetches the public profile and every trip from Polarsteps' unofficial API, uploads any new photos to Sanity (dataset `projects`, tagged with source `polarsteps`), computes the stats for the "By the numbers" section, and rewrites the JSON only when something changed. Photos are then served from Sanity's CDN, resized per use through `lib/image.ts`.

A GitHub Action (`.github/workflows/sync-travel.yml`) runs the sync every three months (1 Jan, Apr, Jul and Oct) and commits the snapshot when it changes, which triggers a Vercel deploy. You can also start it from the **Actions** tab, or run the sync locally and commit after a trip. It needs the repo secret `SANITY_WRITE_TOKEN`.

If Polarsteps is down or rate-limits the sync (HTTP 429), the run fails and the snapshot is left as it was.

## Running the Studio (content editor)

The Studio is its own npm project, so run every command from inside `studio/`:

```bash
cd studio
npm install
npm run dev        # http://localhost:3333
```

On the first visit, log in with your Sanity account. If Sanity asks you to allow `http://localhost:3333` as a CORS origin, follow the link it shows and approve it.

### Deploying the Studio

```bash
cd studio
npx sanity login   # first time only
npm run deploy     # hostname: dayaportfolioback
```

The Studio is hosted at <https://dayaportfolioback.sanity.studio/>, and you can edit content there from any browser. You only need to redeploy when you change files in `studio/`, such as the schema, not when you edit content.

## Editing content

1. Open the Studio ([hosted](https://dayaportfolioback.sanity.studio/) or local at http://localhost:3333) and go to **Project**.
2. Create or edit a project and click **Publish**.
3. The home page picks up changes within about an hour (`revalidate: 3600` in `pages/index.tsx`), with no site redeploy needed.

## Changing the project fields

The site and the Studio must agree on field names. To add or rename a field:

1. Edit `studio/schemaTypes/project.ts` and run `npm run deploy` from `studio/`.
2. Add the field to the GROQ query and the `Project` type in `lib/sanity.ts`, then use it in `pages/index.tsx`.

## Notes

- **Node 18:** `studio/package.json` uses Sanity v3 and pins `glob` to v10 through `overrides`, because newer `glob` versions crash on Node 18. After upgrading to Node 20 or later, you can remove the `overrides` block and upgrade Sanity.
- **No data showing:** if the dataset is private, logged-out API queries return an empty list. Check the dataset's visibility at [sanity.io/manage](https://www.sanity.io/manage), or add a read token to the client.
