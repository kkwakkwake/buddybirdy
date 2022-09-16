const express = require('express');
const dotenv = require('dotenv');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const path = require('path');


const app = express();
dotenv.config();
connectDB();

// to accept JSON data
app.use(express.json());



app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

console.log(__dirname);

// deploy 
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  // app.get("*", (req, res) => {
  //   res.sendFile(__dirname + '/build/index.html')
  // })
  app.get("/", (req, res) => {
    res.sendFile(__dirname + '/build/index.html')
  })
} else {
  app.get('/', (req, res) => {
    res.send('API is Running')
  });
}

// deploy 자동화
// 1.frontend build -> build 폴더 backend로 이동 -> 서버 실행
// 2. frontend 로 이동 ->  node_modules 생성 -> npm run build -> frontend/build 폴더가 server/build로이동
// 3. server 폴더로 이동 -> node_modules 생성 -> server 실행


// deploy done



app.use(notFound)
app.use(errorHandler)


app.get('/api/chat', (req, res) => {
  res.send(chats);
})

app.get('/api/chat/:id', (req, res) => {
  //console.log(req.params.id)
  const singleChat = chats.find(chat => chat._id === req.params.id);
  res.send(singleChat);
})

const server = app.listen(process.env.PORT || 5000, () => console.log('Server Started on PORT 5000'));

// 1분 기다리다가 연결 끊음
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000'
  }
});

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected')
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('user joined room:', room)
  });

  // 'in' means inside that user's room emit or send that message
  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived)
    })
  })
})
