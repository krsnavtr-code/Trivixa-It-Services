const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { join } = require('path');
const { createGzip } = require('zlib');

// Define your site URL
const siteUrl = 'https://trivixa.in'; 

// Define your routes
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/services', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  // Add more routes as needed
];

async function generateSitemap() {
  try {
    // Create a stream to write to
    const sitemapStream = new SitemapStream({
      hostname: siteUrl,
      xmlns: {
        news: false,
        xhtml: true,
        image: false,
        video: false,
      },
    });

    // Create a write stream to save the sitemap
    const writeStream = createWriteStream(join('dist', 'sitemap.xml'));

    // Pipe the sitemap to the write stream
    sitemapStream.pipe(createGzip()).pipe(writeStream);

    // Add URLs to the sitemap
    routes.forEach(route => {
      sitemapStream.write(route);
    });

    // End the stream
    sitemapStream.end();

    // Wait for the sitemap to be generated
    await streamToPromise(sitemapStream);

    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
