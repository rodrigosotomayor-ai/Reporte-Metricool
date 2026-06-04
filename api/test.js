export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const token = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;
  const base = `userId=${userId}&blogId=${blogId}`;
  const from = '2026-04-01T00:00:00';
  const to   = '2026-04-30T23:59:59';

  const endpoints = [
    // Followers / audience
    `/v2/analytics/audience/instagram?from=${from}&to=${to}&${base}`,
    `/v2/analytics/followers/instagram?from=${from}&to=${to}&${base}`,
    `/v2/analytics/instagram/followers?from=${from}&to=${to}&${base}`,
    `/v2/analytics/instagram/audience?from=${from}&to=${to}&${base}`,
    `/stats/instagram/followers?from=${from}&to=${to}&${base}`,
    `/v2/analytics/summary/instagram?from=${from}&to=${to}&${base}`,
    `/v2/analytics/instagram/summary?from=${from}&to=${to}&${base}`,
    `/v2/analytics/instagram/account?from=${from}&to=${to}&${base}`,
    `/v2/analytics/account/instagram?from=${from}&to=${to}&${base}`,
    // Paid media
    `/v2/analytics/facebookads?from=${from}&to=${to}&${base}`,
    `/v2/analytics/ads/facebook?from=${from}&to=${to}&${base}`,
    `/stats/facebookAds?from=${from}&to=${to}&${base}`,
    `/v2/facebookads?from=${from}&to=${to}&${base}`,
    `/v2/analytics/campaigns/facebook?from=${from}&to=${to}&${base}`,
  ];

  const results = [];
  for (const ep of endpoints) {
    try {
      const r = await fetch(`https://app.metricool.com/api${ep}`, {
        headers: { 'X-Mc-Auth': token, 'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0', 'Origin': 'https://app.metricool.com',
          'Referer': 'https://app.metricool.com/' }
      });
      const text = await r.text();
      results.push({ ep: ep.split('?')[0], status: r.status, preview: text.substring(0, 150).replace(/\n/g,'') });
    } catch(e) {
      results.push({ ep: ep.split('?')[0], status: 'ERR', preview: e.message });
    }
  }
  return res.status(200).json(results);
}
