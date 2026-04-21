# GMBSEOTools.com

Next.js affiliate site for Google Business Profile / local SEO tools with MDX content.

## Prerequisites

- Node.js 20+
- [Doppler CLI](https://docs.doppler.com/docs/cli) (for secrets)

## Development

All secrets are managed via Doppler (project: `automationwarrior`, config: `prd`).

```bash
# Install dependencies
npm install

# Run development server (pulls secrets from Doppler automatically)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Content is stored as MDX files in the `/content` directory:
- `/content/blog/` - Blog posts
- `/content/tools/` - Tool listings
- `/content/reviews/` - Tool reviews
- `/content/comparisons/` - Tool comparisons

Each MDX file uses frontmatter for metadata.

## Environment Variables

See `.env.example` for the full list of variables. **Do not create `.env` files** — all secrets come from Doppler at runtime.

To view current secrets:
```bash
doppler secrets --project automationwarrior --config prd
```

## Deployment

Deployed to Vercel. The Vercel project must have Doppler integration enabled or environment variables synced from Doppler.

## Stack

- **Framework**: Next.js 16
- **Content**: MDX files in `/content`
- **Hosting**: Vercel
- **Secrets**: Doppler
- **Analytics**: PostHog, Google Analytics 4
