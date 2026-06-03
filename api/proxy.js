export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token  = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;

  if (!token || !userId || !blogId) {
    return res.status(500).json({
      error: 'Variables de entorno no configuradas. Agrega MC_TOKEN, MC_USER_ID y MC_BLOG_ID en Vercel → Settings → Environment Variables.'
    });
  }

  // Recibir el endpoint y params del query string
  const { endpoint, ...rest } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Falta el parámetro endpoint' });
  }

  const params = new URLSearchParams({ ...rest, userId, blogId });
  const url = `https://app.metricool.com/api${endpoint}?${params}`;

  try {
    const response = await fetch(url, {
      headers: { 'X-Mc-Auth': token }
    });
    const text = await response.text();
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
