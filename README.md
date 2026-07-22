Vislex

An AI-powered legal tech tool for international trade and transactional law, built on Anthropic's Claude API.

Try it live: vislex-ai.vercel.app

Research prototype, not legal advice--verify anything important before using it on a real deal.

What it does
Deal Risk Screener — describe a cross-border deal, get a memo on CFIUS exposure, sanctions risk, and tariff exposure
Document Analyzer — upload a contract, get back flagged trade risks and missing provisions
Live Federal Search — pulls current info from OFAC, CFIUS, USTR Section 301, Commerce AD/CVD, and BIS
Cicero 🏛️ — the built-in AI assistant, styled as a Roman statesman who's seen it all ("Salve! I survived exile and recall by the Roman Senate — OFAC sanctions compliance? Child's play."). Beyond the personality, Cicero actually does the work: answers follow-up questions, takes document uploads, cites its sources, and can turn any answer into a saved memo.
How it's built

Plain HTML/CSS/JS frontend, no framework. A serverless function (api/claude.js) sits between the browser and the Claude API so the API key never touches the client — deployed on Vercel.

vislex/
├── index.html       # frontend
├── api/claude.js     # serverless proxy, holds the API key server-side
├── .gitignore
└── .env.example
Run it yourself
bash
git clone https://github.com/visvaisubramanian1528/vislex.git
cd vislex
cp .env.example .env.local   # then add your own ANTHROPIC_API_KEY
npx vercel dev

Then open http://localhost:3000.

Built by

Visvai Subramanian — Econ major, CS minor, University of Maryland. Made to combine an interest in economics, AI, and legal frameworks.
