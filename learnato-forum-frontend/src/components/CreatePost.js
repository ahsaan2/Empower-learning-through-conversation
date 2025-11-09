import React, { useState } from 'react';
import { createPost } from '../api';

export default function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');          // new author state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError('Title, content, and author are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createPost(title.trim(), content.trim(), author.trim());   // send author
      setTitle('');
      setContent('');
      setAuthor('');
      onPostCreated();
    } catch {
      setError('Failed to create post.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6">
      {error && <div className="mb-2 text-red-600">{error}</div>}
      <input
        disabled={loading}
        type="text"
        placeholder="Your name"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />
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
