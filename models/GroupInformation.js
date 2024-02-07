import mongoose from 'mongoose'
const Schema = mongoose.Schema

const groupInformationSchema = new Schema({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    groupName: {
        type: String
    },
    groupImage: {
        tpye: String
    }
}, { timestamps: true })

const GroupInformation = mongoose.model('GroupInformation', groupInformationSchema)

export default GroupInformation