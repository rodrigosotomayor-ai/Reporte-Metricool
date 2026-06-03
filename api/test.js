export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const token = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;
  const base = `userId=${userId}&blogId=${blogId}`;
  const from = '2026-04-01T00:00:00';
  const to   = '2026-04-30T23:59:59';

  const endpoints = [
    `/v2/analytics/posts/instagram?from=${from}&to=${to}&${base}`,
    `/v2/analytics/posts/facebook?from=${from}&to=${to}&${base}`,
    `/v2/analytics/posts/linkedin?from=${from}&to=${to}&${base}`,
    `/v2/analytics/posts/youtube?from=${from}&to=${to}&${base}`,
    `/v2/analytics/reels/instagram?from=${from}&to=${to}&${base}`,
    `/v2/analytics/stories/instagram?from=${from}&to=${to}&${base}`,
    `/stats/timeling/igFollowers?start=${from}&end=${to}&${base}`,
    `/stats/timeling/igFollowers?startDate=${from}&endDate=${to}&${base}`,
    `/stats/timeling/igFollowers?from=${from}&to=${to}&${base}`,
    `/stats/timeling?network=instagram&from=${from}&to=${to}&${base}`,
    `/v2/stats/instagram?from=${from}&to=${to}&${base}`,
    `/v2/stats/overview?from=${from}&to=${to}&${base}`,
    `/stats/overview?from=${from}&to=${to}&${base}`,
    `/stats/overview?startDate=${from}&endDate=${to}&${base}`,
    `/v2/analytics/overview/instagram?from=${from}&to=${to}&${base}`,
    `/v2/analytics/summary/instagram?from=${from}&to=${to}&${base}`,
    `/v2/networks/instagram/stats?from=${from}&to=${to}&${base}`,
  ];

  const results = [];
  for (const ep of endpoints) {
    try {
      const r = await fetch(`https://app.metricool.com/api${ep}`, {
        headers: { 'X-Mc-Auth': token, 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': 'https://app.metricool.com', 'Referer': 'https://app.metricool.com/' }
      });
      const text = await r.text();
      results.push({ ep: ep.split('?')[0], status: r.status, ok: r.status === 200, preview: text.substring(0, 150).replace(/\n/g,'') });
    } catch(e) {
      results.push({ ep: ep.split('?')[0], status: 'ERR', ok: false, preview: e.message });
    }
  }
  return res.status(200).json(results);
}
