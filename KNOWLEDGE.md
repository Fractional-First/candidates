# Public Profiles Knowledge

Accumulated patterns, decisions, and gotchas for the public-facing profile pages.

## Patterns

### SSR Profile Fetching
- Profiles fetched server-side in `page.tsx` using Supabase server client
- Uses `get_anon_profile` RPC for anonymous profile data
- Structured data (JSON-LD) added for SEO

### Slug Resolution
- Profile slugs are in format: `firstname-lastname-uuid-suffix`
- Anonymous slugs strip identifying info
- Fallback to UUID if slug not found

## Decisions

### 2025-01: Strict TypeScript
- **Context**: Read-only app, fewer runtime errors acceptable
- **Decision**: Use `strict: true` in tsconfig
- **Consequences**: Code shared from talentflow may need null checks added

### 2025-01: App Router (Next.js 15)
- **Context**: SSR needed for SEO
- **Decision**: Use App Router with Turbopack
- **Consequences**: Different patterns than talentflow (Pages Router patterns don't apply)

## Gotchas

### Type Imports from Talentflow
- **Problem**: Types may have different nullability
- **Solution**: Add explicit null checks when using shared types
- **Example**: `profiles.email` is nullable in talentflow but not here

### Supabase Server vs Client
- **Problem**: SSR requires server client, client components need browser client
- **Solution**: Use `src/lib/supabase-server.ts` for RSC, `src/integrations/supabase/client.ts` for client
- **Example**: `src/app/profile/[slug]/page.tsx`

### Build Output Size
- **Problem**: Next.js can create large bundles
- **Solution**: Check bundle with `npm run build` and analyze
- **Workaround**: Use dynamic imports for heavy components

## Key Files

| File | Purpose |
|------|---------|
| `src/app/profile/[slug]/page.tsx` | Profile SSR entry point |
| `src/lib/supabase-server.ts` | Server-side Supabase calls |
| `src/integrations/supabase/types.ts` | Database types (sync with talentflow) |

## External Dependencies

| Service | Purpose | Notes |
|---------|---------|-------|
| Supabase | Database | Read-only access |
| Vercel | Hosting + Edge | candidates.fractionalfirst.com |

## Common Tasks

### Sync Types from Talentflow
```bash
cp ../talentflow/src/integrations/supabase/types.ts \
   src/integrations/supabase/types.ts
npm run build  # Verify it compiles
```

### Check SSR Output
```bash
npm run build
# Look for profile pages in .next/server/app/profile/
```
