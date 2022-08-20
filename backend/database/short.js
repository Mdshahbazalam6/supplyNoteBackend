const mongoose = require('mongoose');

const day = new Date()

const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shortURl: {
        type: String,
        required: true
    },
    day: {
        type: String,
        default: new Date().getDate()
    },
    Hour: {
        type: String,
        default: new Date().getHours()
    },
    minutes: {
        type: String,
        default: new Date().getMinutes()
    },
    CountOfaccessing: {
        type : Number,
        default:0
    },
})

const userModel = new mongoose.model("Url", urlSchema);

module.exports = userModel;