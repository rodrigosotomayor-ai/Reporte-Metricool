export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const token  = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;

  const base = `userId=${userId}&blogId=${blogId}`;

  // Probar distintos formatos de fecha y endpoints
  const endpoints = [
    // Posts - formato ISO
    `/v2/scheduler/posts?startDate=2026-04-01&endDate=2026-04-30&status=PUBLISHED&${base}`,
    `/v2/scheduler/posts?start=2026-04-01&end=2026-04-30&status=PUBLISHED&${base}`,
    `/v2/scheduler/posts?from=2026-04-01&to=2026-04-30&status=PUBLISHED&${base}`,
    `/v2/scheduler/posts?startDate=2026-04-01T00:00:00&endDate=2026-04-30T23:59:59&status=PUBLISHED&${base}`,
    // Stats Instagram - formato ISO
    `/stats/instagram?start=2026-04-01&end=2026-04-30&${base}`,
    `/stats/instagram?startDate=2026-04-01&endDate=2026-04-30&${base}`,
    `/stats/instagram?from=2026-04-01&to=2026-04-30&${base}`,
    // Stats con timestamp ms
    `/stats/instagram?start=1743465600000&end=1746057599000&${base}`,
    // Timeling con formato ISO
    `/stats/timeling/igFollowers?start=2026-04-01&end=2026-04-30&${base}`,
    // Analytics v2
    `/v2/analytics/instagram?from=2026-04-01&to=2026-04-30&${base}`,
    `/v2/analytics/posts/instagram?from=2026-04-01&to=2026-04-30&${base}`,
    // Probar sin fecha para ver qué estructura devuelve
    `/stats/instagram?${base}`,
  ];

  const results = [];
  
  for (const ep of endpoints) {
    try {
      const r = await fetch(`https://app.metricool.com/api${ep}`, {
        headers: {
          'X-Mc-Auth': token,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'Origin': 'https://app.metricool.com',
          'Referer': 'https://app.metricool.com/'
        }
      });
      const text = await r.text();
      let preview = text.substring(0, 200).replace(/\n/g,'');
      results.push({ ep: ep.split('?')[0], params: ep.split('?')[1]?.split('&').filter(p=>!p.startsWith('userId')&&!p.startsWith('blogId')).join('&'), status: r.status, preview });
    } catch(e) {
      results.push({ ep: ep.split('?')[0], status: 'ERR', preview: e.message });
    }
  }

  return res.status(200).json(results);
}
