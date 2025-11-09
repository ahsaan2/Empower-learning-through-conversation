import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api';
import { formatDistanceToNow } from 'date-fns';

export default function PostList({ onSelectPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const fetchedPosts = await fetchPosts('votes');
        setPosts(fetchedPosts);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  function handleKeyDown(e, postId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectPost(postId);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">Discussion Posts</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 italic">No posts yet. Be the first to post!</p>
      ) : (
        <ul className="space-y-8">
          {posts.map(post => (
            <li
              key={post._id}
              tabIndex={0}
              onClick={() => onSelectPost(post._id)}
              onKeyDown={(e) => handleKeyDown(e, post._id)}
              className="cursor-pointer rounded-lg border border-gray-300 p-6 shadow-sm hover:shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label={`Post titled ${post.title} by ${post.author}`}
            >
              {/* Post Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-blue-700 truncate max-w-[75%]" title={post.title}>
                  {post.title}
                </h3>
                <div className="flex space-x-4 text-sm font-medium text-gray-700 select-none">
                  <span className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    <span>🔥</span>
                    <span>{post.votes}</span>
                  </span>
                  <span className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <span>💬</span>
                    <span>{post.replies.length}</span>
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <p className="mt-3 text-gray-700 line-clamp-3" title={post.content}>
                {post.content}
              </p>

              {/* Replies Preview */}
              {post.replies.length > 0 && (
                <div className="mt-5 border-t border-gray-200 pt-4 max-h-48 overflow-y-auto space-y-3">
                  {post.replies.slice(0, 2).map((reply, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-md p-3">
                      <p className="text-gray-800 line-clamp-2" title={reply.content}>
                        {reply.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 select-none">
                        👤 {reply.author} · 🕒 {formatDistanceToNow(new Date(reply.createdAt))} ago
                      </p>
                    </div>
                  ))}
                  {post.replies.length > 2 && (
                    <p className="text-xs text-gray-600 font-semibold mt-1 select-none">
                      +{post.replies.length - 2} more {post.replies.length - 2 === 1 ? 'reply' : 'replies'}...
                    </p>
                  )}
                </div>
              )}

              {/* Post Footer */}
              <p className="mt-6 flex items-center space-x-2 text-sm text-gray-500 select-none">
                <span>👤 {post.author}</span>
                <span>·</span>
                <span>🕒 {formatDistanceToNow(new Date(post.createdAt))} ago</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
