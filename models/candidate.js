const mongoose = require("mongoose");
const User = mongoose.Schema({

    
  name: {
    type: String,
    required: true
},
age: {
    type: Number,
    required: true
},
votes:[
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" , 
            required: true
        }
    }
],
 voteCount: {
    type: Number,
    default : 0
 }
 

});

const userCandidate = mongoose.model("candidate" ,User);

module.exports = userCandidate;