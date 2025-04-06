const mongoose = require("mongoose")

const VoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    options_title: { type: String, required: true },
    votes: { type: Object, required: true }
})

module.exports = mongoose.model('Vote', VoteSchema)