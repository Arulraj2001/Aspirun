interface ContentMetrics {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  text?: string;
  internalLinksCount?: number;
}

export function validateSeoMetrics(route: string, metrics: ContentMetrics) {
  if (process.env.NODE_ENV !== 'development') return;

  const warnings: string[] = [];

  if (!metrics.title || metrics.title.trim().length === 0) {
    warnings.push("❌ Missing Title Tag");
  } else if (metrics.title.length > 60) {
    warnings.push(`⚠️ Title is too long (${metrics.title.length} chars). Keep it under 60.`);
  }

  if (!metrics.description || metrics.description.trim().length === 0) {
    warnings.push("❌ Missing Meta Description");
  } else if (metrics.description.length > 160) {
    warnings.push(`⚠️ Meta Description is too long (${metrics.description.length} chars). Keep it under 160.`);
  } else if (metrics.description.length < 50) {
    warnings.push(`⚠️ Meta Description is too short (${metrics.description.length} chars). Aim for 120-150.`);
  }

  if (!metrics.canonicalUrl) {
    warnings.push("❌ Missing Canonical URL Link");
  } else if (!metrics.canonicalUrl.startsWith('https://')) {
    warnings.push("⚠️ Canonical URL must be absolute and start with https://");
  }

  // Thin content check
  const words = metrics.text ? metrics.text.split(/\s+/).filter(Boolean).length : 0;
  if (words > 0 && words < 200) {
    warnings.push(`⚠️ Thin Content Warning: Only ${words} words found on page. Aim for at least 300+ words.`);
  }

  // Link volume checks
  if (metrics.internalLinksCount === 0) {
    warnings.push("⚠️ Missing Internal links: Page authority cannot flow. Inject at least 1-2 internal links.");
  }

  if (warnings.length > 0) {
    console.warn(`[SEO QC ALERT] Warning summary for route: ${route}\n` + warnings.map(w => `  ${w}`).join('\n'));
  }
}
