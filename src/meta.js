import { SITE_URL, site } from './data/site.js'
import { projects, getProject } from './data/projects.js'

const OG_IMAGE = `${SITE_URL}/og.jpg`

export const routes = ['/', '/resume', ...projects.map((p) => `/work/${p.slug}`)]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: site.name,
  url: SITE_URL,
  jobTitle: 'Web Developer',
  description: 'Web developer who builds products end to end and also does the marketing and sales around them.',
  email: `mailto:${site.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Warangal', addressRegion: 'Telangana', addressCountry: 'IN' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'SR University' },
  knowsAbout: ['Web development', 'React', 'TypeScript', 'FastAPI', 'Digital marketing', 'Sales', 'Search engine optimisation'],
  sameAs: site.links.map((l) => l.href),
}

export function metaFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') {
    return {
      path,
      title: `${site.name} — Web Developer & Growth Expert`,
      description:
        'Rithwik Bandi is a web developer who also does marketing and sales. He builds products end to end and takes them to market. Work includes JobSpace, CardioML, SRU Timetable and Folio.',
      image: OG_IMAGE,
      jsonLd: [
        { '@context': 'https://schema.org', '@graph': [person, { '@type': 'WebSite', '@id': `${SITE_URL}/#site`, url: SITE_URL, name: site.name, publisher: { '@id': `${SITE_URL}/#person` } }] },
      ],
    }
  }

  if (path === '/resume') {
    return {
      path,
      title: `Resume — ${site.name}`,
      description: `The resume of ${site.name}, web developer. View it here, download it, or open the original PDF.`,
      image: OG_IMAGE,
      jsonLd: [],
    }
  }

  const slug = path.split('/')[2]
  const project = path.startsWith('/work/') ? getProject(slug) : null
  if (project) {
    return {
      path,
      title: `${project.title}: case study — ${site.name}`,
      description: project.description,
      image: OG_IMAGE,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/#work` },
            { '@type': 'ListItem', position: 3, name: project.title, item: `${SITE_URL}${path}` },
          ],
        },
      ],
    }
  }

  return {
    path,
    title: `Page not found — ${site.name}`,
    description: 'This page does not exist.',
    image: OG_IMAGE,
    noindex: true,
    jsonLd: [],
  }
}

// All head tags carry data-seo so the client can swap them on navigation.
export function headTags(m) {
  const url = `${SITE_URL}${m.path}`
  const t = (s) => `${s}`.replace(/\n\s*/g, '')
  return t(`
<title data-seo>${esc(m.title)}</title>
<meta data-seo name="description" content="${esc(m.description)}" />
<link data-seo rel="canonical" href="${url}" />
${m.noindex ? '<meta data-seo name="robots" content="noindex" />' : ''}
<meta data-seo property="og:type" content="website" />
<meta data-seo property="og:site_name" content="${esc(site.name)}" />
<meta data-seo property="og:title" content="${esc(m.title)}" />
<meta data-seo property="og:description" content="${esc(m.description)}" />
<meta data-seo property="og:url" content="${url}" />
<meta data-seo property="og:image" content="${m.image}" />
<meta data-seo property="og:image:width" content="1200" />
<meta data-seo property="og:image:height" content="630" />
<meta data-seo name="twitter:card" content="summary_large_image" />
<meta data-seo name="twitter:title" content="${esc(m.title)}" />
<meta data-seo name="twitter:description" content="${esc(m.description)}" />
<meta data-seo name="twitter:image" content="${m.image}" />
${m.jsonLd.map((j) => `<script data-seo type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('')}
`)
}
