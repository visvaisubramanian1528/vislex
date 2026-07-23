// This function runs on Vercel's server, never in the browser.
// The API key lives only in an environment variable here — it is
// never sent to, or visible from, the client.

// ── Simple in-memory rate limiter ──
// Note on limits: this Map only persists for the lifetime of one warm
// serverless instance. Vercel can spin up multiple instances under load,
// and a cold start resets this to empty. So this is NOT a perfectly
// airtight global limit — a determined attacker spread across many
// instances could still get around it. What it DOES reliably stop is the
// common case: a script hammering the endpoint from one place, which is
// exactly the cheap, likely abuse path for a public link with no login.
// A fully robust limit would need a shared store (e.g. Upstash Redis) —
// worth adding later if usage patterns ever show it's needed.
const requestLog = new Map(); // ip -> array of timestamps (ms)
const WINDOW_MS = 60 * 1000;   // 1 minute window
const MAX_PER_WINDOW = 8;      // max requests per IP per minute

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(t => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  // Prevent unbounded memory growth from many distinct IPs over time
  if (requestLog.size > 5000) requestLog.clear();
  return timestamps.length > MAX_PER_WINDOW;
}

const MAX_BODY_BYTES = 60 * 1024; // ~60KB cap on request size, to bound cost per call

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return;
  }

  const bodySize = Buffer.byteLength(JSON.stringify(req.body || {}), 'utf8');
  if (bodySize > MAX_BODY_BYTES) {
    res.status(413).json({ error: 'Request too large.' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server misconfigured: ANTHROPIC_API_KEY is not set' });
    return;
  }

  try {
    // Forward whatever the frontend sent (model, system, messages, tools, etc.)
    // straight through to Anthropic, adding the key server-side.
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
