import React, { useState } from 'react';
import { addReply } from '../api';
import { Filter } from 'bad-words';

import { toast } from 'react-toastify';

const filter = new Filter();

export default function ReplyForm({ postId, onReplyAdded }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Reply content cannot be empty');
      return;
    }
    if (content.trim().length > 500) {
      toast.error('Reply cannot exceed 500 characters');
      return;
    }
    if (filter.isProfane(content)) {
      toast.error('Please remove profane words');
      return;
    }

    setLoading(true);
    try {
      await addReply(postId, content.trim());
      toast.success('Reply added!');
      setContent('');
      onReplyAdded();
    } catch {
      toast.error('Failed to add reply');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 max-w-xl mx-auto">
      <textarea
        rows={3}
        placeholder="Write your reply..."
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        disabled={loading}
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
