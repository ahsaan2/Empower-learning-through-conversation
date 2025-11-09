import React, { useEffect, useState } from 'react';
import { fetchPostById, upvotePost } from '../api';
import ReplyForm from './ReplyForm';
import { toast } from 'react-toastify';

export default function PostDetail({ postId, onBack }) {
  const [post, setPost] = useState(null);
  const [loadingUpvote, setLoadingUpvote] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const fetchedPost = await fetchPostById(postId);
        setPost(fetchedPost);
      } catch {
        toast.error('Failed to load post');
      }
    }
    loadPost();
  }, [postId]);

  async function handleUpvote() {
    setLoadingUpvote(true);
    try {
      const data = await upvotePost(postId);
      setPost(prev => ({ ...prev, votes: data.votes }));
      toast.success('Post upvoted!');
    } catch {
      toast.error('Failed to upvote post');
    } finally {
      setLoadingUpvote(false);
    }
  }

  async function handleReplyAdded() {
    try {
      const updatedPost = await fetchPostById(postId);
      setPost(updatedPost);
    } catch {
      toast.error('Failed to update replies');
    }
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded shadow max-w-4xl mx-auto sm:p-6 md:p-8">
      <button onClick={onBack} className="text-blue-500 mb-4 hover:underline">
        ← Back to posts
      </button>

      <h2 className="text-3xl font-bold mb-2 break-words">{post.title}</h2>
      <p className="mb-4 whitespace-pre-wrap break-words">{post.content}</p>

      <button
        onClick={handleUpvote}
        disabled={loadingUpvote}
        className="bg-blue-600 text-white px-4 py-1 rounded mb-6 hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loadingUpvote ? 'Upvoting...' : `Upvote (${post.votes})`}
      </button>

      <h3 className="font-semibold text-xl mb-2">Replies</h3>
      <ul className="mb-6 max-h-96 overflow-auto">
        {post.replies.length === 0 && <li className="italic text-gray-600">No replies yet.</li>}
        {post.replies.map((reply, idx) => (
          <li key={idx} className="border-b py-2 whitespace-pre-wrap break-words">
            {reply.content}
          </li>
        ))}
      </ul>

      <ReplyForm postId={postId} onReplyAdded={handleReplyAdded} />
    </div>
  );
}
