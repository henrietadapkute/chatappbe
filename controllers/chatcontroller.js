import Chat from '../models/Chat.js'
import Message from'../models/Message.js'

async function createChat(req, res) {
    try {
        const { participants } = req.body
        const chat = new Chat({ participants })
        await chat.save()
        res.status(200).json(chat)
    } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message })
    }
}

async function getChatsbyUser(req, res) {
    try {
        const user = req.user
        const chats = await Chat.find({ participants: { $in: [user._id] } })
        res.json(chats)
    } catch (error) {
     res.status(500).json({message: 'Server error', error: error.message })    
    }
}

async function getMessages(req, res) {
  try {
    const chatId = req.params.chatId
    const messages = await Message.find({ chat: chatId })
    res.json(messages)
} catch (error) {
     res.status(500).json({message: 'Server error', error: error.message })  
    }
}

async function sendMessage(req, res) {

}

async function messageRead(req, res) {

}
async function deleteChat(req, res) {

}

export default {
    createChat,
    getChatsbyUser,
    getMessages,
    sendMessage,
    messageRead,
    deleteChat
}