const mongoose = require("mongoose")

const userSchema =  new mongoose.Schema({
    firstname : String,
    lastname : String,
    phone : String,
    email : String,
    password : String,
    role: {
        type: String,
        enum: ["admin", "editor", "user"], // Allowed roles
        default: "user",
      },

})

const user =  mongoose.model ('user' , userSchema)
module.exports = user 