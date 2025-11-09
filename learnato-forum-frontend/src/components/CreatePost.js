import React, { useState } from 'react';
import { createPost } from '../api';
import { Filter } from 'bad-words';

const filter = new Filter();

export default function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validations
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    if (title.trim().length > 100) {
      setError('Title cannot exceed 100 characters');
      return;
    }
    
    if (content.trim().length > 1000) {
      setError('Content cannot exceed 1000 characters');
      return;
    }

    // Profanity filter check
    if (filter.isProfane(title) || filter.isProfane(content)) {
      setError('Please remove profane words from your input');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await createPost(title.trim(), content.trim());
      setTitle('');
      setContent('');
      onPostCreated();
    } catch {
      setError('Failed to create post.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6 max-w-xl mx-auto">
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <input
        disabled={loading}
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
      <textarea
        disabled={loading}
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={4}
        className="w-full p-2 mb-3 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Submitting...' : 'Submit Post'}
      </button>
    </form>
  );
}
