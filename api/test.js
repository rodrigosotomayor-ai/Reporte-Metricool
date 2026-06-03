export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const token  = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;

  const endpoints = [
    `/stats/instagram?start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
    `/stats/facebook?start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
    `/v2/analytics/instagram?from=20260401&to=20260430&userId=${userId}&blogId=${blogId}`,
    `/stats/timeling/igFollowers?start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
    `/v2/scheduler/posts?start=20260401&end=20260430&status=PUBLISHED&userId=${userId}&blogId=${blogId}`,
    `/api/stats/instagram?start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
    `/v1/stats/instagram?start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
    `/stats/social?network=instagram&start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
    `/evolution/instagram?start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
    `/analytics/instagram?start=20260401&end=20260430&userId=${userId}&blogId=${blogId}`,
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
      let preview = text.substring(0, 120);
      results.push({ endpoint: ep.split('?')[0], status: r.status, preview });
    } catch(e) {
      results.push({ endpoint: ep.split('?')[0], status: 'ERROR', preview: e.message });
    }
  }

  return res.status(200).json(results);
}
