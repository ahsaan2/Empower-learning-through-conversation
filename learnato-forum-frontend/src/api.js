import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/posts';

export async function fetchPosts(sortBy = 'votes') {
  const response = await axios.get(`${API_BASE}?sortBy=${sortBy}`);
  return response.data;
}

export async function fetchPostById(id) {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
}

export async function createPost(title, content, author) {
  const response = await axios.post(API_BASE, { title, content, author });
  return response.data;
}

export async function addReply(postId, content, author) {
  const response = await axios.post(`${API_BASE}/${postId}/reply`, { content, author });
  return response.data;
}

export async function upvotePost(postId) {
  const response = await axios.post(`${API_BASE}/${postId}/upvote`);
  return response.data;
}
