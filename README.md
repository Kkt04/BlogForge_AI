# BlogForge AI ✦

An AI-powered blog post generator built with React, Node.js, Express, and the Groq API (LLaMA 3.3-70B). Enter a topic, choose your tone and length, and get a structured, publish-ready blog post in seconds.

---

## Features

- AI-generated blog posts with configurable tone (Professional, Casual, Persuasive, Informative)
- Word count targeting (~300 / ~600 / ~1000 words)
- Optional keyword injection for SEO
- Live stats: word count, read time, section count
- One-click copy to clipboard
- Deployable to Vercel (serverless) or run locally with Express

---

## Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React 18, Vite, CSS           |
| Backend    | Node.js, Express              |
| AI         | Groq API (LLaMA 3.3-70B)      |
| Deployment | Vercel (serverless functions) |

---

## Project Structure

```
blogforge-ai/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── GenerateForm.jsx
│   │   │   └── BlogOutput.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   ├── vite.config.js       # Dev proxy for /api → localhost:5001
│   └── index.html
│
├── server/                  # Node/Express backend (local dev)
│   ├── routes/
│   │   └── generate.js      # Groq API integration
│   └── index.js
│
├── api/
│   └── generate.js          # Vercel serverless function (production)
│
└── .github/
    └── workflows/
        └── deploy.yml       # CI checks
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A [Groq API key](https://console.groq.com/)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/blogforge-ai.git
cd blogforge-ai
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env   # then paste your Groq API key
```

Update `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5001
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:5001`, so no extra config is needed.

App will be live at `http://localhost:3000`.

---

## Environment Variables

| Variable       | Location       | Description                     |
|----------------|----------------|---------------------------------|
| `GROQ_API_KEY` | server / api   | Your Groq API key               |
| `PORT`         | server         | Server port (default `5001`)    |

> `.env` files are git-ignored, so your API key never gets committed.
> Reference `.env.example` for the required variables.

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add the `GROQ_API_KEY` environment variable in the Vercel dashboard
4. Vercel uses `vercel.json` to build the client and route `/api/*` to the serverless function

---

## License

MIT
