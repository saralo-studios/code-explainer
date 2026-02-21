async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options)
    if (res.status === 503) {
      try {
        const body = await res.json()
        const wait = (body.estimated_time ?? 15) * 1000
        await new Promise((r) => setTimeout(r, wait))
        continue
      } catch (e) {
        await new Promise((r) => setTimeout(r, 15000))
        continue
      }
    }
    return res
  }
  throw new Error('Model failed to load after retries')
}

export async function explainCode(code) {
  const model = process.env.HF_MODEL || 'HuggingFaceH4/zephyr-7b-beta'
  const token = process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN
  if (!token) throw new Error('Missing HUGGINGFACE_API_TOKEN in environment')

  // Use router endpoint (recommended) — compatible with provider routing
  const endpoint = `https://router.huggingface.co/models/${model}`

  const prompt = `<|system|>\nYou are a helpful assistant that explains code clearly and concisely to beginners.</s>\n<|user|>\nExplain the following code step by step:\n\n\`\`\`\n${code}\n\`\`\`</s>\n<|assistant|>`

  const res = await fetchWithRetry(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 1024, temperature: 0.3, return_full_text: false }
    })
  }, 3)

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Hugging Face API error (${res.status}): ${txt}`)
  }

  const data = await res.json()
  // typical shapes: [{generated_text: '...'}] or {generated_text: '...'}
  if (Array.isArray(data) && data[0] && data[0].generated_text) {
    return data[0].generated_text.trim()
  }
  if (data.generated_text) return String(data.generated_text).trim()
  return JSON.stringify(data)
}
