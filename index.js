const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const postsRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// mongoose.connect('mongodb://localhost:27017/learnato_forum', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log('MongoDB connection error:', err));
mongoose.connect('mongodb://localhost:27017/learnato_forum')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


app.set('io', io);

// Use routes
app.use('/posts', postsRoutes);

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
