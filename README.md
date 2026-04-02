# BlogForge AI ✦

An AI-powered blog post generator built with React, Node.js, Express, and the Groq API (LLaMA 3.3-70B). Enter a topic, choose your tone and length, and get a structured, publish-ready blog post in seconds.

---

## Features

- AI-generated blog posts with configurable tone (Professional, Casual, Persuasive, Informative)
- Word count targeting (~300 / ~600 / ~1000 words)
- Optional keyword injection for SEO
- Live stats: word count, read time, section count
- One-click copy to clipboard
- Deployed on Vercel with GitHub Actions CI/CD

---

## Tech Stack

| Layer      | Tech                        |
|------------|-----------------------------|
| Frontend   | React 18, Vite, CSS         |
| Backend    | Node.js, Express            |
| AI         | Groq API (LLaMA 3.3-70B)   |
| Deployment | Vercel + GitHub Actions     |

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
│   └── index.html
│
├── server/                  # Node/Express backend
│   ├── routes/
│   │   └── generate.js      # Groq API integration
│   └── index.js
│
└── .github/
    └── workflows/
        └── deploy.yml       # CI/CD pipeline
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A [Groq API key](https://console.groq.com/)
- A [Vercel account](https://vercel.com/) (for deployment)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/blogforge-ai.git
cd blogforge-ai
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
ANTHROPIC_API_KEY=your_groq_api_key_here
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

Create a `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

App will be live at `http://localhost:3000`

---

## Deployment

This project uses **GitHub Actions** to auto-deploy to **Vercel** on every push to `main`.

### Steps:
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add `VERCEL_TOKEN` to GitHub repository secrets
4. Set environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY` → your Groq API key
5. Any push to `main` triggers automatic deployment

---

## Environment Variables

| Variable           | Location | Description              |
|--------------------|----------|--------------------------|
| `ANTHROPIC_API_KEY`| server   | Your Groq API key        |
| `PORT`             | server   | Server port (default 5001)|
| `VITE_API_URL`     | client   | Backend URL              |
