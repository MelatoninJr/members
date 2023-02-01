const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    title: String,
    message: String,
    time: Date.now()
})

module.exports('Message', messageSchema)