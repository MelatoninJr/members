const express = require('express');
const router = express.Router();
const Message = require("../schema/message");

router.get('/', async (req, res) => {
    const messageArray = await Message.find({}).sort({ time: -1 });
    res.render('./views/messages', { messages: messageArray, user: req.user });
    });

router.post('/', async (req, res) => {
  const newMessage = new Message({
    title: req.body.title,
    message: req.body.message,
    userid: req.user.username
  });

  try {
    await newMessage.save();
    console.log("save message success");
    res.redirect('/messages');
  } catch(err) {
    console.error(err.message);
  }
});



router.delete('/:id', async (req, res) => {
    try {
      const deletedMessage = await Message.findOneAndDelete({ _id: req.params.id });
      if (!deletedMessage) return res.status(404).json({ message: 'Message not found' });
      return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  




module.exports = router;
