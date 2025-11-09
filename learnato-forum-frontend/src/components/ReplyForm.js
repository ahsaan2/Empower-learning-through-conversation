import React, { useState } from 'react';
import { addReply } from '../api';

export default function ReplyForm({ postId, onReplyAdded }) {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || !author.trim()) {
      setError('Reply content and author are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addReply(postId, content.trim(), author.trim());
      setContent('');
      setAuthor('');
      onReplyAdded();
    } catch {
      setError('Failed to add reply');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <input
        type="text"
        placeholder="Your name"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        disabled={loading}
        className="w-full p-2 mb-2 border rounded"
      />
      <textarea
        rows={3}
        placeholder="Write your reply..."
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={loading}
        className="w-full p-2 mb-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:bg-green-300"
      >
        {loading ? 'Submitting...' : 'Submit Reply'}
      </button>
    </form>
  );
}
