const mongoose = require("mongoose")

const VoteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    votes: { type: Object, required: true }
})

module.exports = mongoose.model('Vote', VoteSchema)