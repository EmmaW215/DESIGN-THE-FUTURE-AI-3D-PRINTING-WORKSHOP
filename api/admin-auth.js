/**
 * Vercel Serverless API: Admin password verification.
 * Set ADMIN_PASSWORD in Vercel Environment Variables (e.g. DESIGN-THE-FUTURE-ai).
 * Never expose this value to the client.
 */

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    console.error('ADMIN_PASSWORD is not set in Vercel environment.');
    return res.status(500).json({ ok: false });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ ok: false });
  }

  const password = body.password;
  if (typeof password !== 'string') {
    return res.status(200).json({ ok: false });
  }

  if (password === secret) {
    return res.status(200).json({ ok: true });
  }

  return res.status(200).json({ ok: false });
}
