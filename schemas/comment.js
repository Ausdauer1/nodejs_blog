const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const commentSchema = new mongoose.Schema({
    
    nickname: {
        type:String,
        require: true,
    },
    comment: {
        type: String,
    },
    articleId: {
        type: Number,
        require: true
    }
});

commentSchema.plugin(AutoIncrement, {inc_field: 'id2'})

module.exports = mongoose.model("Comments", commentSchema)