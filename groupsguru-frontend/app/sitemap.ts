import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://groupsguru.in', lastModified: new Date(), priority: 1.0 },
    { url: 'https://groupsguru.in/login', lastModified: new Date(), priority: 0.8 },
    { url: 'https://groupsguru.in/register', lastModified: new Date(), priority: 0.8 },
  ];
}
