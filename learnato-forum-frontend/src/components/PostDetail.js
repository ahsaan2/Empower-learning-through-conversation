import React, { useEffect, useState } from 'react';
import { fetchPostById, addReply, upvotePost } from '../api';

export default function PostDetail({ postId, onBack }) {
  const [post, setPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    async function loadPost() {
      const fetchedPost = await fetchPostById(postId);
      setPost(fetchedPost);
    }
    loadPost();
  }, [postId]);

  async function handleAddReply() {
    if (!replyContent.trim()) return;
    const updatedPost = await addReply(postId, replyContent.trim());
    setPost(updatedPost);
    setReplyContent('');
  }

  async function handleUpvote() {
    const data = await upvotePost(postId);
    setPost(prev => ({ ...prev, votes: data.votes }));
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded shadow">
      <button onClick={onBack} className="text-blue-500 mb-4">← Back to posts</button>
      <h2 className="text-3xl font-bold mb-2">{post.title}</h2>
      <p className="mb-4">{post.content}</p>
      <div className="mb-4">
        <button onClick={handleUpvote} className="bg-blue-600 text-white px-4 py-1 rounded">Upvote ({post.votes})</button>
      </div>
      <h3 className="font-semibold text-xl mb-2">Replies</h3>
      <ul className="mb-4">
        {post.replies.map((reply, idx) => (
          <li key={idx} className="border-b py-1">{reply.content}</li>
        ))}
      </ul>
      <div>
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows="3"
          placeholder="Add a reply..."
          value={replyContent}
          onChange={e => setReplyContent(e.target.value)}
        />
        <button onClick={handleAddReply} className="bg-green-600 text-white px-4 py-1 rounded">Submit Reply</button>
      </div>
    </div>
  );
}
