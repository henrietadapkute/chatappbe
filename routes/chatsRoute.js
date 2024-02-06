import express from 'express';
import chatcontroller from '../controllers/chatcontroller.js'

const router = express.Router()

router.get('/', chatcontroller.getChatsbyUser)
router.get('/chats/user/:userId', chatcontroller.getChatsbyUser)
router.get('/previews', chatcontroller.getPreviews)
router.get('/search/user', chatcontroller.searchUserbyUsername)
router.get('/:chatId/messages', chatcontroller.getMessages)

// This should be the route
router.post('/', chatcontroller.createChat)
// Kept additional to keep current functionality
router.post('/create', chatcontroller.createChat)
router.post('/create/chat', chatcontroller.createChat)

router.delete('/:chatId', chatcontroller.deleteChat)

export const chatRouter = router
