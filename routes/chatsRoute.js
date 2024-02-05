import express from 'express';
import chatcontroller from '../controllers/chatcontroller.js'

const router = express.Router()

router.get('/', chatcontroller.getChatsbyUser)
router.get('/:chatId/messages', chatcontroller.getMessages)

// This should be the route
router.post('/', chatcontroller.createChat)
// Kept additional to keep current functionality
router.post('/create', chatcontroller.createChat)
router.post('/create/chat', chatcontroller.createChat)

export const chatRouter = router
