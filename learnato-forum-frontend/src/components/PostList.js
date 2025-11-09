import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api';

export default function PostList({ onSelectPost }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const allPosts = await fetchPosts();
      setPosts(allPosts);
    }
    loadPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      {posts.map(post => (
        <div key={post._id} className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-100" onClick={() => onSelectPost(post._id)}>
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
          <div className="text-sm text-gray-500 pt-1">
            Votes: {post.votes} | Replies: {post.replies.length}
          </div>
        </div>
      ))}
    </div>
  );
}
