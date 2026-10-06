---
name: vercel-deploy
description: >-
  Comprehensive guide and automated runbook for deploying Next.js App Router applications to Vercel,
  managing deployment environments, and executing post-deployment live-site verification QA.
---

# Vercel Deployment & Live QA Skill

This skill guides the automated deployment and verification of Next.js applications on Vercel.

## Workflow Phases

### Phase 1: Pre-Deployment Audit
1. Run local lint and production build:
   ```bash
   npm run lint && npm run build
   ```
2. Verify clean git state and git push:
   ```bash
   git status --short
   git push origin master
   ```

### Phase 2: Vercel Project Deployment
1. If deploying via Vercel CLI directly:
   ```bash
   npx vercel --prod --yes
   ```
   Or for temporary claimable deployment:
   ```bash
   npx vercel deploy --temporary
   ```
2. Alternatively, link the GitHub repository directly at [vercel.com/new](https://vercel.com/new) selecting the repository `Walshwade-dev/ruth-cms`.

### Phase 3: Post-Deployment Live QA
Once deployed, perform automated smoke testing against the live production URL:
1. Verify HTTP 200 OK on core routes:
   - `/` (Home)
   - `/portfolio` (Portfolio Grid)
   - `/portfolio/poultry-preparation` (Detail route)
   - `/portfolio/herbed-chicken` (Detail route)
   - `/about` (About page)
   - `/learning-journey` (Learning Journey)
   - `/contact` (Contact)
   - `/robots.txt` (Robots)
   - `/sitemap.xml` (Sitemap)
2. Verify image assets load properly from `/images/...`.
3. Check 404 behavior for invalid or unconfirmed slugs.
4. Verify response headers, SSL certificate, and caching.
