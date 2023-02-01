const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema ({

    username: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    membership: { type: String, required: true,  default: "basic"},
})


module.exports = mongoose.model('User', userSchema)

