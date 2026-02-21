import { explainCode } from '../../lib/explain'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code } = req.body || {}
  if (!code) return res.status(400).json({ error: 'Missing code in request body' })

  try {
    const explanation = await explainCode(code)
    return res.status(200).json({ explanation })
  } catch (err) {
    const msg = err && err.message ? err.message : String(err)
    return res.status(500).json({ error: msg })
  }
}
