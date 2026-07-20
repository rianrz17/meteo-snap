/**
 * Vercel Serverless Function - BMKG Peringatan Dini Cuaca (Nowcast CAP) Proxy
 * Mengambil RSS feed resmi BMKG dan menyaring peringatan yang menyebut
 * "Kalimantan Timur", supaya bisa dipakai langsung oleh dashboard.
 *
 * Usage: /api/warning
 */
function decodeXmlEntities(str){
  return (str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

function extractTag(block, tag){
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return m ? decodeXmlEntities(m[1]) : '';
}

export default async function handler(req, res) {
  const feedUrl = 'https://www.bmkg.go.id/alerts/nowcast/id/rss.xml';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'MeteoSnap/1.0 (BMKG Proxy)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'BMKG alert feed error',
        status: response.status
      });
    }

    const xml = await response.text();
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items = [];
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const title = extractTag(block, 'title');

      // Filter hanya peringatan yang menyebut Kalimantan Timur
      if (!/kalimantan timur/i.test(title)) continue;

      items.push({
        title,
        link: extractTag(block, 'link'),
        description: extractTag(block, 'description'),
        pubDate: extractTag(block, 'pubDate'),
      });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
      fetched_at: new Date().toISOString()
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Request timeout',
        message: 'BMKG alert feed tidak merespons dalam 10 detik'
      });
    }
    return res.status(503).json({
      error: 'Service unavailable',
      message: error.message
    });
  }
}
