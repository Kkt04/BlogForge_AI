import { useState } from 'react';
import Navbar from './components/Navbar';
import GenerateForm from './components/GenerateForm';
import BlogOutput from './components/BlogOutput';
import './App.css';

export default function App() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError('');
    setBlog(null);

    try {
      const isProd = import.meta.env.PROD;
      const apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || '');
      const res = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg = data?.error || `Generation failed with status ${res.status}. Please try again.`;
        throw new Error(errorMsg);
      }

      if (!data || !data.title || !Array.isArray(data.sections)) {
        throw new Error('Received unexpected blog post format from the server.');
      }

      setBlog(data);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <main className="container" id="generate">
        <section className="hero">
          <div className="hero-badge">✦ Powered by LLaMA 3.3 70B & Groq</div>
          <h1 className="hero-title">
            Generate Blog Posts<br />
            <span className="highlight">in Seconds</span>
          </h1>
          <p className="hero-subtitle">
            Enter a topic, pick your tone, and let AI craft a polished, publish-ready blog post for you.
          </p>
        </section>

        <GenerateForm onGenerate={handleGenerate} loading={loading} />
        {error && <p className="error">{error}</p>}
        {blog && <BlogOutput blog={blog} />}
      </main>
    </div>
  );
}
