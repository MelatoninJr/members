const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: Date, required: true, default: Date.now},
    userid: { type: String, required: true}
})

module.exports = mongoose.model('Message', messageSchema)