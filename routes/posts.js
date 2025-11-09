// Example update for create post endpoint
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  try {
    const newPost = new Post({ title, content });
    await newPost.save();

    const io = req.app.get('io');
    io.emit('newPost', newPost);  // Emit event to all connected clients

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Similarly emit for adding reply
router.post('/:id/reply', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Reply content is required' });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.replies.push({ content });
    await post.save();

    const io = req.app.get('io');
    io.emit('newReply', { postId: post._id, reply: post.replies[post.replies.length - 1] });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Emit for upvote
router.post('/:id/upvote', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.votes += 1;
    await post.save();

    const io = req.app.get('io');
    io.emit('postUpvoted', { postId: post._id, votes: post.votes });

    res.json({ votes: post.votes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
