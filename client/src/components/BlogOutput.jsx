import { useState } from 'react';

export default function BlogOutput({ blog }) {
  const [copied, setCopied] = useState(false);

  const fullText = `${blog.title}\n\n` +
    blog.sections.map(s => `${s.heading}\n${s.content}`).join('\n\n');

  const wordCount = fullText.split(' ').length;

  const copy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card output-card">
      <div className="output-header">
        <span className="badge">Generated Post</span>
        <button className="btn-ghost" onClick={copy}>
          {copied ? 'Copied!' : 'Copy all'}
        </button>
      </div>
      <div className="stats-row">
        <div className="stat"><strong>{wordCount}</strong><span>words</span></div>
        <div className="stat"><strong>{Math.max(1, Math.round(wordCount/200))}</strong><span>min read</span></div>
        <div className="stat"><strong>{blog.sections.length}</strong><span>sections</span></div>
      </div>
      <h1 className="blog-title">{blog.title}</h1>
      {blog.sections.map((s, i) => (
        <div key={i} className="blog-section">
          <h2>{s.heading}</h2>
          <p>{s.content}</p>
        </div>
      ))}
    </div>
  );
}
