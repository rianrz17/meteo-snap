/**
 * Vercel Serverless Function - BMKG Weather API Proxy
 * Mengatasi CORS block dengan proxy dari server side
 * 
 * Usage: /api/weather?adm2=64.08
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { adm2 } = req.query;

  // Validasi parameter
  if (!adm2) {
    return res.status(400).json({ 
      error: 'Parameter adm2 diperlukan',
      example: '/api/weather?adm2=64.08'
    });
  }

  try {
    // Fetch dari BMKG API dengan timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

    const bmkgUrl = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm2=${encodeURIComponent(adm2)}`;
    
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

    // Handle non-OK responses
    if (!response.ok) {
      console.error(`[PROXY] BMKG returned ${response.status}`);
      return res.status(response.status).json({
        error: 'BMKG API error',
        status: response.status,
        message: `BMKG API returned status ${response.status}`
      });
    }

    const data = await response.json();

    // Validasi response format
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.warn(`[PROXY] Invalid BMKG response format for adm2=${adm2}`);
      return res.status(502).json({
        error: 'Invalid response format from BMKG',
        adm2: adm2
      });
    }

    // Success - return data dengan cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // 5 min cache
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json({
      success: true,
      data: data.data,
      fetched_at: new Date().toISOString(),
      adm2: adm2
    });

  } catch (error) {
    // Handle timeout
    if (error.name === 'AbortError') {
      console.error('[PROXY] Request timeout to BMKG');
      return res.status(504).json({
        error: 'Request timeout',
        message: 'BMKG API tidak merespons dalam waktu 10 detik'
      });
    }

    // Handle network errors
    console.error('[PROXY] Error fetching from BMKG:', error.message);
    return res.status(503).json({
      error: 'Service unavailable',
      message: error.message,
      adm2: adm2
    });
  }
}
