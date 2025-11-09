import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api';
import { formatDistanceToNow } from 'date-fns';

export default function PostList({ onSelectPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Since only sort by votes remains, we remove sortBy state and always fetch sorted by votes
  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const fetchedPosts = await fetchPosts('votes'); // always fetch sorted by votes
        setPosts(fetchedPosts);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold">Posts</h2>
        {/* Removed Sort by Date button */}
        <div>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white cursor-default"
            disabled
          >
            Sorting by Votes
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li
              key={post._id}
              className="cursor-pointer border-b border-gray-300 py-3 hover:bg-gray-50"
              onClick={() => onSelectPost(post._id)}
            >
              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
              <p className="text-gray-700 mb-1 truncate">{post.content}</p>
              <p className="text-sm text-gray-500">
                Posted by: {post.author} · {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
              <div className="text-sm text-gray-600 mt-1">
                Votes: {post.votes} | Replies: {post.replies.length}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
