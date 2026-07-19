/**
 * Vercel Serverless Function - BMKG Weather API Proxy
 * Mengatasi CORS block dengan proxy dari server side.
 *
 * Usage: /api/weather?adm2=64.72
 */
export default async function handler(req, res) {
  const { adm2 } = req.query;

  if (!adm2) {
    return res.status(400).json({
      error: 'Parameter adm2 diperlukan (kode kabupaten/kota)',
      example: '/api/weather?adm2=64.72'
    });
  }

  const bmkgUrl = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm2=${encodeURIComponent(adm2)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

    console.log(`[PROXY] Fetching from BMKG: ${bmkgUrl}`);
    const response = await fetch(bmkgUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'MeteoSnap/1.0 (BMKG Proxy)',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[PROXY] BMKG returned ${response.status}`);
      return res.status(response.status).json({
        error: 'BMKG API error',
        status: response.status,
        message: `BMKG API returned status ${response.status}`
      });
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.warn(`[PROXY] Invalid BMKG response format for adm2=${adm2}`);
      return res.status(502).json({
        error: 'Invalid response format from BMKG',
        adm2: adm2
      });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      success: true,
      data: data.data,
      fetched_at: new Date().toISOString(),
      adm2: adm2
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[PROXY] Request timeout to BMKG');
      return res.status(504).json({
        error: 'Request timeout',
        message: 'BMKG API tidak merespons dalam waktu 10 detik'
      });
    }
    console.error('[PROXY] Error fetching from BMKG:', error.message);
    return res.status(503).json({
      error: 'Service unavailable',
      message: error.message,
      adm2: adm2
    });
  }
}
