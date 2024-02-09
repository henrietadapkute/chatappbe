import express, { Router } from 'express'
import path from 'path'
import 'dotenv/config'
import cors from 'cors'
import '../../config/database.js'
import bodyParser from 'body-parser'
import checkToken from '../../config/checkToken.js'
import { userRouter } from '../../routes/api/usersRoute.js'
import { chatRouter } from '../../routes/chatsRoute.js'
import { Server } from 'socket.io'
import { createServer } from 'http';
import serverless from 'serverless-http'

const api = express()
const server = createServer(api)

api.use(cors())
api.use(bodyParser.json())
api.use(checkToken)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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

const router = Router()

// USERS API
router.use('/users', userRouter)
router.use('/chats', chatRouter)

// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// }); 

api.use('/api/', router)

export const handler = serverless(api)

