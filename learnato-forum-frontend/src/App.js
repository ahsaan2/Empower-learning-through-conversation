  import React, { useEffect, useState } from 'react';
  import PostList from './components/PostList';
  import PostDetail from './components/PostDetail';
  import socket from './socket';

  function App() {
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // to trigger PostList refresh

    useEffect(() => {
      socket.on('newPost', () => {
        setRefreshKey(oldKey => oldKey + 1);
      });
      socket.on('newReply', () => {
        setRefreshKey(oldKey => oldKey + 1);
      });
      socket.on('postUpvoted', () => {
        setRefreshKey(oldKey => oldKey + 1);
      });
      return () => {
        socket.off('newPost');
        socket.off('newReply');
        socket.off('postUpvoted');
      };
    }, []);

    return (
      <div className="max-w-4xl mx-auto p-4">
        {!selectedPostId ? (
          <PostList key={refreshKey} onSelectPost={setSelectedPostId} />
        ) : (
          <PostDetail postId={selectedPostId} onBack={() => setSelectedPostId(null)} />
        )}
      </div>
    );
  }

  export default App;
