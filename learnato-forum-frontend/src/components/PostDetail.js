import React, { useEffect, useState } from 'react';
import { fetchPostById, upvotePost } from '../api';
import ReplyForm from './ReplyForm';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetail({ postId, onBack }) {
  const [post, setPost] = useState(null);
  const [loadingUpvote, setLoadingUpvote] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchPostById(postId);
      setPost(data);
    }
    load();
  }, [postId]);

  async function handleUpvote() {
    setLoadingUpvote(true);
    try {
      const data = await upvotePost(postId);
      setPost(prev => ({ ...prev, votes: data.votes }));
    } finally {
      setLoadingUpvote(false);
    }
  }

  async function handleReplyAdded() {
    const updatedPost = await fetchPostById(postId);
    setPost(updatedPost);
  }

  if (!post) return <div className="text-center my-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">
        ← Back to posts
      </button>

      <h2 className="text-3xl font-bold mb-1">{post.title}</h2>
      <p className="text-gray-600 mb-3 text-sm">
        Posted by: {post.author} · {formatDistanceToNow(new Date(post.createdAt))} ago
      </p>
      <p className="mb-6 whitespace-pre-wrap">{post.content}</p>

      <button
        onClick={handleUpvote}
        disabled={loadingUpvote}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
      >
        {loadingUpvote ? 'Upvoting...' : `Upvote (${post.votes})`}
      </button>

      <h3 className="text-xl font-semibold mb-4">Replies ({post.replies.length})</h3>
      <ul className="mb-8 overflow-auto max-h-80 border rounded p-4">
        {post.replies.length === 0 && (
          <li className="text-gray-500 italic">No replies yet.</li>
        )}
        {post.replies.map((reply, idx) => (
          <li key={idx} className="border-b last:border-b-0 py-2">
            <p className="mb-1">{reply.content}</p>
            <p className="text-sm text-gray-500">
              By {reply.author} · {formatDistanceToNow(new Date(reply.createdAt))} ago
            </p>
          </li>
        ))}
      </ul>

      <ReplyForm postId={postId} onReplyAdded={handleReplyAdded} />
    </div>
  );
}
