const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);



const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    nickname: {
        type:String,
        require: true,
    },
    comment: {
        type: String,
        require: true,
    },
    date:{
        type: String,
        require: true,
    },
    
    
});

articleSchema.plugin(AutoIncrement, {inc_field: 'id'})


module.exports = mongoose.model("Articles", articleSchema)