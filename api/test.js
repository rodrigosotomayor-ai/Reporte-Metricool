export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const token = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;
  const base = `userId=${userId}&blogId=${blogId}`;
  const from = '2026-04-01T00:00:00';
  const to   = '2026-04-30T23:59:59';

  // Obtener muestra real de datos para mapear estructura
  const r = await fetch(`https://app.metricool.com/api/v2/analytics/posts/instagram?from=${from}&to=${to}&${base}`, {
    headers: { 'X-Mc-Auth': token, 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Origin': 'https://app.metricool.com', 'Referer': 'https://app.metricool.com/' }
  });
  const data = await r.json();
  // Devolver primer post completo para ver todas las keys disponibles
  return res.status(200).json({ total: data.data?.length, first: data.data?.[0], keys: data.data?.[0] ? Object.keys(data.data[0]) : [] });
}
