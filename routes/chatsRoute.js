import express from 'express' 
const router = express.Router()
import chatcontroller from '../controllers/chatcontroller.js'

router.post('/create/chat', chatcontroller.createChat)
router.get('chats/user/:userId', chatcontroller.getChatsbyUser)
router.get('chat/:chatId/messages', chatcontroller.getMessages)
router.post('')

export const chatRouter = router