import Chat from '../models/Chat.js'
import Message from'../models/Message.js'
import User from '../models/User.js'

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
        console.log(user)
        const chats = await Chat.find({ participants: { $in: [user._id] } })
        res.json(chats)
    } catch (error) {
     res.status(500).json({message: 'Server error', error: error.message })    
    }
}

async function getPreviews(req, res) {
    try {
        const userId = req.user._id
        const chats = await Chat.find({ participants: { $in: [userId] } })
        const previews = await Promise.all(chats.map(async (chat) => {
            const latestMessage = await Message.findOne({chatId : chat._id}).sort({timestamp: -1}).exec()
            let otherParticipant = null
            if(chat.chatType !== 'group') {
                const otherParticipantId = chat.participants.find(id => id.toString() !== userId)
                otherParticipant = await User.findById(otherParticipantId)
            }
            return {
                chatId: chat._id,
                latestMessage,
                otherParticipant
            }
        }))
        res.json(previews)
    } catch (err) {

        console.log(err)
        res.status(500).send('Error fetching chat previews')
    }
}

async function getMessages(req, res) {
  try {
    const chatId = req.params.chatId
    const messages = await Message.find({ chatId: chatId })
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
    getPreviews,
    getMessages,
    sendMessage,
    messageRead,
    deleteChat
}