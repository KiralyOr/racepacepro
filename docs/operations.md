# Operations

Hosting, domain, and search setup for racepacepro.com. Not needed to develop the app.
See `CLAUDE.md` for that.

## Pending manual steps

These need account access and cannot be done from the repo.

- [x] **Google Search Console**: domain verified, sitemap submitted and processed
      (63 URLs). Steps kept below for reference.
- [x] **Vercel Web Analytics**: enabled and reporting. Dashboard is the project's
      Analytics tab. The tag ships on all 63 pages from `src/analytics.js`.
- [ ] **Bing Webmaster Tools**: <https://www.bing.com/webmasters>. Bing has already
      sent real search traffic and there is currently no visibility into which
      queries. It can import the site directly from Search Console rather than
      making you verify again.
- [ ] **Request indexing** in Search Console for `/`, `/pace/` and `/predictor/`.
      The sitemap went from 47 to 63 URLs; these three are the ones worth pushing.
- [ ] **Trademark search on the name.** Worth an hour of a solicitor's time before
      investing further in the brand rather than after. The failure mode is not a
      lawsuit, it is having to rename at the point where the site has links worth
      losing. The race names on the marathon pages are a separate question and the
      posture there is already right: referential use, no logos, `rel="nofollow"`
      on every official link, and a disclaimer in the footer of every page.
- [ ] **Check the social card**: paste a marathon page into
      <https://www.opengraph.xyz>. Each race has its own 1200x630 card now, so
      `racepacepro.com/marathons/boston/` and `/marathons/berlin/` should look
      different from each other.
- [ ] **Cancel GoDaddy Websites + Marketing** if it is a paid plan. The builder site
      is disconnected and serving nothing. Check
      <https://account.godaddy.com/subscriptions>. Cancel only that plan, **never**
      the domain registration.

### Getting links, which is the actual bottleneck

The site is technically finished. It has no inbound links, and that combination
ranks for very little. Nothing in the repo changes this.

What works, roughly by yield per hour:

1. **Running clubs and coaches.** Most club sites have a links or resources page
   maintained by a volunteer who would like something useful to put on it. The offer
   is real: free, no ads, no signup, no email capture. Twenty emails is realistically
   two to five permanent, topically relevant links.
2. **Reddit, carefully.** Most running subreddits ban promotion of new tools
   outright, and r/firstmarathon says so explicitly. Read the rules, and message the
   mods rather than posting and hoping. Reddit links are `nofollow` so they pass
   little ranking signal directly; the value is traffic, and traffic reaching people
   who own sites of their own.
3. **The marathon guides are the linkable asset, not the calculator.** There are
   fifty pace calculators. There are very few pages explaining that Paris loses GPS
   in the Seine tunnels or that Vienna's first half is paced by people who stop at
   21 km.

Five to fifteen good links over six months is a solid outcome. Anyone offering
hundreds is selling a liability.

### Reading the numbers

Two dashboards, different jobs. **Search Console** says what people searched and
which pages got clicks. **Vercel Analytics** says what visitors did once they
arrived, and which referrer sent them, which is the only way to tell whether a post
or an outreach email worked.

Your own visits count in Vercel and there is no self exclusion on the free tier, so
early numbers are mostly you.

Watch the **Pages** report in Search Console. If the generated pages get indexed but
attract no impressions after a couple of months, that is the signal the keyword
targets are wrong, not that more pages are needed.

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

The sitemap is generated at build time and lists all 63 URLs: the home page, the
four distance hubs and thirty goal time pages under `/pace/`, the two guides, the
race time predictor, and the marathon index plus 22 race pages. `llms.txt` lists the
same set for agents that read rather than crawl, and a test fails if the two ever
disagree.

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
