import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/my-page/',
    },
    sitemap: 'https://www.proengineer1exam.com/sitemap.xml',
  }
}