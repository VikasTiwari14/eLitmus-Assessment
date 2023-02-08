const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://VikasTiwari14:1234@cluster0.v3x9gyk.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log("Admin Database Connection Successfull");
})
.catch((err) => {
    console.log(err);
})

const admin = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    password : String,
},{
    collection: "admins"
})

const adminCollection = new mongoose.model('admins', admin);

module.exports = adminCollection;