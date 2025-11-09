const express = require('express');
const router = express.Router();
const Post = require('../models/Posts');

// Create new post
router.post('/', async (req, res) => {
  const io = req.app.get('io');
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }
  try {
    const newPost = new Post({ title, content, author });
    await newPost.save();
    io.emit('newPost', newPost);
    res.status(201).json(newPost);
  } catch {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// List all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ votes: -1, createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Add reply
router.post('/:id/reply', async (req, res) => {
  const io = req.app.get('io');
  const { content, author } = req.body;
  if (!content || !author) {
    return res.status(400).json({ error: 'Reply content and author are required' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.replies.push({ content, author });
    await post.save();

    io.emit('newReply', { postId: post.id, reply: post.replies[post.replies.length - 1] });
    res.status(201).json(post);
  } catch {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// Upvote post
router.post('/:id/upvote', async (req, res) => {
  const io = req.app.get('io');
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.votes = (post.votes || 0) + 1;
    await post.save();

    io.emit('postUpvoted', { postId: post.id, votes: post.votes });
    res.json(post);
  } catch (err) {
    console.error('Upvote error:', err);
    res.status(500).json({ error: 'Failed to upvote post' });
  }
});


module.exports = router;
