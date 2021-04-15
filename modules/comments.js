var mongoose = require("mongoose")

var commentsSchema = new mongoose.Schema({
    author : {
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        },
        username: String
    },
    text : String
})

module.exports = mongoose.model("Comment",commentsSchema)