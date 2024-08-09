const { Router } = require('express');
const router = Router();
const { isAuthenticated } = require('../helpers/auth');
const mongoose = require('mongoose');
const User = require('../models/User');
const Message = require('../models/Message');
const { getMessagesWithUser } = require('../controllers/chat.controller');

async function getUsers(loggedInUserId) {
  try {
    const users = await User.find({ _id: { $ne: new mongoose.Types.ObjectId(loggedInUserId) } }, 'nombre profilePicture');
    
    const usersWithLastMessage = await Promise.all(users.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: loggedInUserId, receiver: user._id },
          { sender: user._id, receiver: loggedInUserId }
        ]
      }).sort({ timestamp: -1 });

      return {
        ...user.toObject(),
        lastMessage: lastMessage ? lastMessage.toObject() : null,
      };
    }));

    return usersWithLastMessage;
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    return [];
  }
}

router.get('/chat', isAuthenticated, async (req, res) => {
  const loggedInUserId = req.user ? req.user._id : null;
  const users = await getUsers(loggedInUserId);
  res.render('chat/chat', { users, user: req.user });
});

router.get('/chat/:userId', isAuthenticated, async (req, res) => {
  const userId = req.params.userId;
  const loggedInUserId = req.user ? req.user._id : null;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid user ID');
  }
  const users = await getUsers(loggedInUserId);
  const selectedUser = await User.findById(new mongoose.Types.ObjectId(userId));
  const messages = await getMessagesWithUser(loggedInUserId, userId);
  res.render('chat/chat', { users, selectedUser, messages, user: req.user });
});

module.exports = router;
