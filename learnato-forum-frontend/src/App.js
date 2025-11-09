import React, { useEffect, useState } from 'react';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import socket from './socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    socket.on('newPost', () => setRefreshKey(k => k + 1));
    socket.on('newReply', () => setRefreshKey(k => k + 1));
    socket.on('postUpvoted', () => setRefreshKey(k => k + 1));
    return () => {
      socket.off('newPost');
      socket.off('newReply');
      socket.off('postUpvoted');
    };
  }, []);

  function handlePostCreated() {
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {!selectedPostId && <CreatePost onPostCreated={handlePostCreated} />}
      {!selectedPostId ? (
        <PostList key={refreshKey} onSelectPost={setSelectedPostId} />
      ) : (
        <PostDetail postId={selectedPostId} onBack={() => setSelectedPostId(null)} />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
