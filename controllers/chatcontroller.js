import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import GroupInformation from "../models/GroupInformation.js";

async function createChat(req, res) {
  try {
    const userId = req.user._id;
    let { participants } = req.body;
    participants = [...participants, userId];
    let chatType = "private";
    if (participants.length > 2) chatType = "group";
    const chat = new Chat({ participants: participants, chatType: chatType });
    await chat.save();
    if (chatType === "group") {
      const group = new GroupInformation({
        chatId: chat._id,
        adminId: userId,
        groupName: `${req.user.username}'s Group`,
      });
      await group.save();
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getChatsbyUser(req, res) {
  try {
    const user = req.user;
    console.log(user);
    const chats = await Chat.find({ participants: { $in: [user._id] } });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function searchUserbyUsername(req, res) {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
async function getPreviews(req, res) {
  console.log("test");
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ participants: { $in: [userId] } });
    let previews = await Promise.all(
      chats.map(async (chat) => {
        const latestMessage = await Message.findOne({ chatId: chat._id })
          .sort({ timestamp: -1 })
          .exec();
        let otherParticipant = null;
        if (chat.chatType !== "group") {
          const otherParticipantId = chat.participants.find(
            (id) => id.toString() !== userId
          );
          otherParticipant = await User.findById(otherParticipantId);
        } else {
          const groupInformation = await GroupInformation.findOne({
            chatId: chat._id,
          });
          otherParticipant = {
            username: groupInformation.groupName,
            profileImage: groupInformation?.groupImage,
          };
        }
        return {
          chatId: chat._id,
          chatType: chat.chatType,
          latestMessage,
          otherParticipant,
        };
      })
    );
    previews = previews.sort((a, b) => {
      const dateA = a.latestMessage
        ? new Date(a.latestMessage.timestamp)
        : new Date(0);
      const dateB = b.latestMessage
        ? new Date(b.latestMessage.timestamp)
        : new Date(0);
      return dateB - dateA;
    });
    res.json(previews);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat previews");
  }
}

async function getMessages(req, res) {
  try {
    const userId = req.user._id;

    const chatId = req.params.chatId;

    await Message.updateMany(
      { chatId: chatId, senderId: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    const messages = await Message.find({ chatId: chatId });
    console.log(chatId, messages);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function sendMessage(req, res) {}

async function messageRead(req, res) {}
async function deleteChat(req, res) {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatId;
    const chat = await Chat.findByIdAndDelete(chatId);
    const message = await Message.deleteMany({ chatId: chatId });
    console.log(chat);
    // const messages = await Message.find({ chatId })
    // console.log(messages)
    // if (!chat) {
    //   return res.status(404).json({ message: 'Chat not found' })
    // }

    // if (!chat.participants.includes(userId)) {
    //   return res.status(403).json({ message: 'Cannot delete chat' })
    // }

    // await chat.remove();
    // await Message.deleteMany({ chatId })

    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export default {
  createChat,
  getChatsbyUser,
  searchUserbyUsername,
  getPreviews,
  getMessages,
  sendMessage,
  messageRead,
  deleteChat,
};
