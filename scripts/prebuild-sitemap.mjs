import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://fortunekenya.com';
const API_BASE = 'https://fortunekenya.com/v1/api';

const staticPaths = [
  { path: "/", priority: 1.0, changefreq: 'daily' },
  { path: "/about", priority: 0.8, changefreq: 'monthly' },
  { path: "/services", priority: 0.9, changefreq: 'weekly' },
  { path: "/contact", priority: 0.7, changefreq: 'monthly' },
  { path: "/faqs", priority: 0.6, changefreq: 'monthly' },
  { path: "/privacy", priority: 0.5, changefreq: 'yearly' },
  { path: "/support", priority: 0.7, changefreq: 'monthly' },
];

async function fetchAPI(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.warn(`⚠️  Failed to fetch ${path}: ${res.status}`);
      return null;
    }
    
    const data = await res.json();
    return data?.data ?? null;
  } catch (error) {
    console.error(`❌ Error fetching ${path}:`, error.message);
    return null;
  }
}

async function generateSitemap() {
  console.log('🔄 Fetching dynamic data from API...\n');
  
  const [navData, servicesData, testimonialsData] = await Promise.all([
    fetchAPI('/navigation'),
    fetchAPI('/services'),
    fetchAPI('/testimonials'),
  ]);

  const urls = new Map();

  // Add static pages
  console.log('📄 Adding static pages...');
  staticPaths.forEach(({ path, priority, changefreq }) => {
    urls.set(path, {
      loc: `${SITE_URL}${path}`,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
    });
  });
  console.log(`   ✓ Added ${staticPaths.length} static pages\n`);

  // Add navigation items
  if (navData) {
    console.log('🧭 Adding navigation items...');
    let navCount = 0;
    
    navData.navItems?.forEach((item) => {
      if (item.isActive && item.href && !urls.has(item.href)) {
        urls.set(item.href, {
          loc: `${SITE_URL}${item.href}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.85,
        });
        navCount++;
      }
    });

    // Add dropdown items
    Object.values(navData.dropdownData || {}).forEach((dropdown) => {
      dropdown?.items?.forEach((i) => {
        if (i.isActive && i.href && !urls.has(i.href)) {
          urls.set(i.href, {
            loc: `${SITE_URL}${i.href}`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.85,
          });
          navCount++;
        }
      });
    });
    
    console.log(`   ✓ Added ${navCount} navigation items\n`);
  }

  // Add services
  if (servicesData?.services) {
    console.log('🛠️  Adding services...');
    servicesData.services.forEach((s) => {
      const servicePath = `/services/${s.slug}`;
      urls.set(servicePath, {
        loc: `${SITE_URL}${servicePath}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9,
      });
    });
    console.log(`   ✓ Added ${servicesData.services.length} services\n`);
  }

  // Add testimonials
  if (testimonialsData) {
    console.log('💬 Adding testimonials...');
    const activeTestimonials = testimonialsData.filter((t) => t.isActive);
    
    activeTestimonials.forEach((t) => {
      const testimonialPath = `/testimonials/${t.id}`;
      urls.set(testimonialPath, {
        loc: `${SITE_URL}${testimonialPath}`,
        lastmod: t.updatedAt ? new Date(t.updatedAt).toISOString() : new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
      });
    });
    console.log(`   ✓ Added ${activeTestimonials.length} testimonials\n`);
  }

  // Generate XML
  const urlsArray = Array.from(urls.values());
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsArray.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public folder
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log('✅ Sitemap generation complete!');
  console.log(`📊 Total URLs: ${urlsArray.length}`);
  console.log(`📝 Saved to: public/sitemap.xml\n`);
}

// Run the script
generateSitemap().catch(error => {
  console.error('❌ Fatal error generating sitemap:', error);
  process.exit(1);
});