import express from 'express'
import path from 'path'
import 'dotenv/config'
import cors from 'cors'
import './config/database.js'
import bodyParser from 'body-parser'
import checkToken from './config/checkToken.js'
import { userRouter } from './routes/api/usersRoute.js'
import { chatRouter } from './routes/chatsRoute.js'
import { Server } from 'socket.io'
import { createServer } from 'http';

const app = express()
const server = createServer(app)

app.use(cors())
app.use(bodyParser.json())
app.use(checkToken)

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND,
    methods: ["GET", "POST"],
  }
})

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`)

  socket.on("join_room", (chatId) => {
    socket.join(chatId)
    console.log(`Socket ${socket.id} joined room ${chatId}`)
  })

  socket.on("send_message", (data) => {
    console.log(data.chatId)
    socket.to(data.chatId).emit("receive_message", data)
  }) 

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`)
    socket.broadcast.emit('user_disconnected', { userId: socket.id} )
  })
})

const port = process.env.PORT || 4000
// USERS API
app.use('/api/users', userRouter)
app.use('/api/chats', chatRouter)

// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// }); 

server.listen(port, () => {
  console.log(`Listening on port: ${port}`)
});

