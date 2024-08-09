const Message = require('../models/Message');

async function saveMessage(senderId, receiverId, message) {
  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text: message,
      timestamp: new Date(),
    });
    await newMessage.save();
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
  }
}

async function getMessagesWithUser(loggedInUserId, userId) {
  try {
    const messages = await Message.find({
      $or: [
        { sender: loggedInUserId, receiver: userId },
        { sender: userId, receiver: loggedInUserId }
      ]
    }).sort({ timestamp: 1 });
    return messages;
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    return [];
  }
}

module.exports = {
  saveMessage,
  getMessagesWithUser,
};
