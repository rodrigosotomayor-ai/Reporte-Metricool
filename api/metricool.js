export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, ...params } = req.query;

  if (!endpoint) {
    res.status(400).json({ error: 'Missing endpoint parameter' });
    return;
  }

  // Credenciales Metricool (variables de entorno en Vercel)
  const token  = process.env.MC_TOKEN;
  const userId = process.env.MC_USER_ID;
  const blogId = process.env.MC_BLOG_ID;

  if (!token || !userId || !blogId) {
    res.status(500).json({ error: 'Missing Metricool credentials in environment variables' });
    return;
  }

  // Construir URL hacia Metricool
  const queryParams = new URLSearchParams({ ...params, userId, blogId });
  const url = `https://app.metricool.com/api${decodeURIComponent(endpoint)}?${queryParams}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Mc-Auth': token,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
