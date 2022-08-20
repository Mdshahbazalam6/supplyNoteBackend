const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function (next) {
    // this.isModified('password'))
    this.password = await bcryptjs.hash(this.password, 12)
    next()
})

const userModel = new mongoose.model('User', userSchema)
module.exports = userModel