const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    nickname: {
        type:String,
        require: true,
    },
    password: {
        type:String,
        require: true,
    },
  
    
});

userSchema.virtual("userId").get(function () {
    return this._id.toHexString();
});
userSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Users", userSchema)