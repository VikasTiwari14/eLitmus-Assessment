const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://VikasTiwari14:1234@cluster0.v3x9gyk.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log("User Database Connection Successfull");
})
.catch((err) => {
    console.log(err);
})

const user = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    testInvitationCode : String,
    testTime : String,
    images : Array,
    testDetails : Object
},{
    collection: "users"
})

const userCollection = new mongoose.model('users', user);

module.exports = userCollection;