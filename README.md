# Vislex

Vislex is an AI-powered legal tech tool for international trade and transactional law, built on Anthropic's Claude API. It helps screen cross-border deals, analyze contracts, and search regulatory context — all in one place.

**Live demo:** [vislex-ai.vercel.app](https://vislex-ai.vercel.app)

> This is a research prototype, not legal advice. All outputs should be independently verified before any deal use. Vislex is not affiliated with any government agency, law firm, or commercial tech provider.

## Features

- **Deal Risk Screener** — describe a cross-border transaction and get a structured memo covering CFIUS exposure, sanctions risk, tariff exposure, and due diligence priorities.
- **Document Analyzer** — upload a contract and get a review flagging trade risk, supply chain exposure, and missing provisions.
- **Live Federal Search** — pulls current regulatory context from OFAC, CFIUS, USTR Section 301, Commerce AD/CVD, and BIS.
- **Cicero** — an in-app AI assistant for follow-up questions, document uploads, and guidance through the tool, with adjustable style and depth. In addition, Cicero has an highlight feature where the user can highlight any text, and they hav ethe option to, "Explain," "Simplify," or "Define Term."

## Tech stack

- Frontend: HTML, CSS, JavaScript (single-page, no framework)
- Backend: a serverless proxy function (`api/claude.js`) that calls the Claude API server-side, so no API key is ever exposed to the browser
- Deployment: [Vercel](https://vercel.com)
- Model: Claude (Anthropic API), including web search tool use for live regulatory lookups

## Project structure

```
vislex/
├── index.html          # frontend
├── api/
│   └── claude.js        # serverless proxy — holds the API key server-side
├── .gitignore
└── .env.example          # template for the required environment variable
```

## Running locally

1. Clone the repo and install the Vercel CLI:
   ```bash
   git clone https://github.com/visvaisubramanian1528/vislex.git
   cd vislex
   npm install -g vercel   # or use npx vercel below if you'd rather not install globally
   ```

2. Copy the environment template and add your own Anthropic API key:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and set:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```

3. Run the dev server:
   ```bash
   npx vercel dev
   ```

4. Open `http://localhost:3000`.

## Security note

All requests to the Claude API go through the serverless function in `api/claude.js`. The API key lives only in an environment variable on the server (or in Vercel's environment variable settings) — it is never sent to or readable from the browser.

## About

Built by [Visvai Subramanian](https://www.linkedin.com/in/visvai-subramanian-536a6a2a6/) — Economics major, Computer Science minor, University of Maryland. Built to combine an interest in economics, AI, and legal frameworks.
