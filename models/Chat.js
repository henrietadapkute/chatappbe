import mongoose from 'mongoose'
const Schema = mongoose.Schema

const chatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    chatType: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Chat = mongoose.model('Chat', chatSchema)

export default Chat