import { MetadataRoute } from 'next'

// Search-and-index crawlers, and the AI answer-engine crawlers we want to be
// able to cite/answer with our content — both currently allowed the same
// public paths as everyone else. Broken out into named rules (rather than
// one wildcard) so any of these can be tuned individually later without
// having to restructure the file.
const DISALLOW = ['/admin', '/api/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // Search engines
      { userAgent: 'Googlebot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Bingbot', allow: '/', disallow: DISALLOW },
      // AI answer-engine / assistant crawlers
      { userAgent: 'GPTBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: DISALLOW },
      { userAgent: 'ClaudeBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Claude-Web', allow: '/', disallow: DISALLOW },
      { userAgent: 'PerplexityBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Google-Extended', allow: '/', disallow: DISALLOW },
      { userAgent: 'CCBot', allow: '/', disallow: DISALLOW },
      { userAgent: 'Bytespider', allow: '/', disallow: DISALLOW },
      { userAgent: 'Amazonbot', allow: '/', disallow: DISALLOW },
    ],
    sitemap: 'https://kiamburoad.com/sitemap.xml',
  }
}
