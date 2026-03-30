import { useState } from 'react';

export default function GenerateForm({ onGenerate, loading }) {
  const [form, setForm] = useState({
    topic: '', tone: 'Professional', wordCount: '~600 words', keywords: ''
  });

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.topic.trim()) return;
    onGenerate(form);
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Blog Topic</label>
        <input name="topic" value={form.topic} onChange={handleChange}
          placeholder="e.g. How AI is changing the hiring process" required />
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label>Tone</label>
          <select name="tone" value={form.tone} onChange={handleChange}>
            {['Professional','Casual','Persuasive','Informative'].map(t =>
              <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Word Count</label>
          <select name="wordCount" value={form.wordCount} onChange={handleChange}>
            {['~300 words','~600 words','~1000 words'].map(w =>
              <option key={w}>{w}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Keywords <span className="optional">(optional)</span></label>
        <input name="keywords" value={form.keywords} onChange={handleChange}
          placeholder="e.g. machine learning, recruitment, automation" />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Generating...' : '✦ Generate Blog Post'}
      </button>
    </form>
  );
}