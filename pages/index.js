import { useState } from 'react'

export default function Home() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState(null)

  async function handleExplain(e) {
    e.preventDefault()
    setLoading(true)
    setExplanation(null)
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await res.json()
      setExplanation(data.explanation)
    } catch (err) {
      setExplanation('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h1>Code Explainer (stub)</h1>
      <form onSubmit={handleExplain}>
        <label style={{ display: 'block', marginBottom: 8 }}>Paste code to explain:</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste source code here..."
          rows={12}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: 14, padding: 8 }}
        />
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading || !code.trim()}>
            {loading ? 'Explaining...' : 'Explain code'}
          </button>
        </div>
      </form>

      {explanation && (
        <section style={{ marginTop: 24 }}>
          <h2>Explanation</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f8fa', padding: 12 }}>{explanation}</pre>
        </section>
      )}
    </main>
  )
}
