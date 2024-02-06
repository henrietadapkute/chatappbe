import Message from "../models/Message.js";

export default {
    create
}

async function create(req, res) {
    try {
        const chatId = req.params.chatId
        const userId = req.user._id
        const message = new Message({
            chatId: chatId,
            senderId: userId,
            content: req.body.content,
            timestamp: new Date()
        })
        await message.save()
        res.status(200).json(message)
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message })
    }
}