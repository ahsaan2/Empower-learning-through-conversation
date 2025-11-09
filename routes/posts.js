const express = require('express');
const router = express.Router();
const Post = require('../models/post'); // Ensure casing matches your file name

// Get all posts - sorted by votes and date
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ votes: -1, createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

  try {
    const newPost = new Post({ title, content });
    await newPost.save();

    const io = req.app.get('io');
    io.emit('newPost', newPost);  // Emit real-time event

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post with replies by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add reply to a post
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

// Upvote a post
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

module.exports = router;
