# Operations

Hosting, domain, and search setup for racepacepro.com. Not needed to develop the app.
See `CLAUDE.md` for that.

## Pending manual steps

These need account access (Google, GoDaddy) and can't be done from the repo.

- [ ] **Google Search Console**: verify the domain and submit the sitemap (steps below)
- [ ] **Check the social card**: send `https://racepacepro.com` to yourself on WhatsApp, or
      paste it into <https://www.opengraph.xyz>. Should show the blue stopwatch card.
- [ ] **Cancel GoDaddy Websites + Marketing** if it's a paid plan. The builder site is
      disconnected and serving nothing. Check <https://account.godaddy.com/subscriptions>.
      Cancel only that plan, **never** the domain registration.

### Google Search Console

1. <https://search.google.com/search-console> → **Add property**
2. Choose **Domain** (not URL prefix) → enter `racepacepro.com`
3. Copy the `google-site-verification=…` string it gives you
4. GoDaddy → My Products → Domains → racepacepro.com → **Manage DNS** → Add New Record:

   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | TXT  | `@`  | `google-site-verification=…` | 1 Hour |

5. Wait ~5 min, then **Verify** in Search Console
6. Sidebar → **Sitemaps** → submit `sitemap.xml`

Impressions data takes days to weeks to appear.

The sitemap is generated at build time and lists the home page plus every page
under `/pace/`, 35 URLs at the time of writing. Watch the **Pages** report in
Search Console after submitting: if the generated pages get indexed but attract
no impressions after a couple of months, that is the signal the keyword targets
are wrong, not that more pages are needed.

## How the domain is wired

`racepacepro.com` is registered at GoDaddy, DNS is hosted by GoDaddy
(`ns13`/`ns14.domaincontrol.com`), and it serves from **Vercel**.

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | `@`  | `76.76.21.21`          |
| CNAME | `www`| `cname.vercel-dns.com.`|

There are no MX records, so nothing here affects email. Nameservers stay at GoDaddy.
Do not move them to Vercel, that would take DNS management with it.

The domain is added under the Vercel **team**-level Domains page
(<https://vercel.com/kiralyors-projects/~/domains>), not project settings, because this Vercel
version moved it.

## Two traps worth remembering

**The A record was `WebsiteBuilder Site`, not an IP.** GoDaddy Websites + Marketing owns
the apex A record while a builder site is published to the domain, and displays a label
instead of an address. Until that's changed the domain serves GoDaddy no matter what
Vercel says. If the A record ever reverts, a builder site has been reconnected.

**`homepage` in `package.json` must stay `"."`.** An absolute URL there bakes a
`/racepacepro/` prefix onto every asset, which works on the GitHub Pages subpath but
404s at a domain root, so the Vercel site renders blank. See `CLAUDE.md`.

## Deploy targets

A push to `main` deploys twice, both automatic:

- **Vercel** → production, serves `racepacepro.com`. Also builds a preview per PR.
- **GitHub Actions** (`.github/workflows/deploy.yml`) → `gh-pages` branch, serves
  `https://kiralyor.github.io/racepacepro`.

The GitHub Pages copy is a leftover from before the domain moved to Vercel. It's harmless
but redundant, and it's a second URL serving the same content, worth retiring if search
ever shows the two competing.
