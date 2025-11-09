import axios from 'axios';

const API_BASE = 'http://localhost:5000/posts';

export async function fetchPosts() {
  const response = await axios.get(API_BASE);
  return response.data;
}

export async function fetchPostById(id) {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
}

export async function createPost(title, content) {
  const response = await axios.post(API_BASE, { title, content });
  return response.data;
}

export async function addReply(postId, content) {
  const response = await axios.post(`${API_BASE}/${postId}/reply`, { content });
  return response.data;
}

export async function upvotePost(postId) {
  const response = await axios.post(`${API_BASE}/${postId}/upvote`);
  return response.data;
}
