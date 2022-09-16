const Chat = require('../models/chatmodel')
const Message = require('../models/messageModel')
const User = require('../models/userModel')

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body
  console.log(content)
  console.log(chatId)

  if (!content || !chatId) {
    console.log('Invalid data passed into request')
    return res.sendStatus(400)
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

const allMessage = async (req, res) => {
  try {
    // 리퀘스트 파라미터로 id전달

    const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name pic email').populate('chat')

    res.json(messages)
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

module.exports = { sendMessage, allMessage }