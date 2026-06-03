export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token  = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;

  if (!token || !userId || !blogId) {
    return res.status(500).json({ error: 'Variables de entorno no configuradas: MC_TOKEN, MC_USER_ID, MC_BLOG_ID' });
  }

  const { endpoint, ...rest } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Falta endpoint' });

  const params = new URLSearchParams({ ...rest, userId, blogId });
  const url = `https://app.metricool.com/api${endpoint}?${params}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Mc-Auth': token,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; MetricoolProxy/1.0)',
        'Accept': 'application/json',
        'Origin': 'https://app.metricool.com',
        'Referer': 'https://app.metricool.com/'
      }
    });

    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');

    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch {
      return res.status(response.status).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
