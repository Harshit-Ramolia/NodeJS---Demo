var mongoose = require("mongoose")

var campSchema = new mongoose.Schema({
    name : String,
    image : String,
    discription : String,
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ],
    author : {
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        },
        username: String
    }
})

module.exports = mongoose.model("camp",campSchema)