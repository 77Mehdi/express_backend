import { Schema, model } from "mongoose"

const UserSchema = new Schema({
    
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },
    email: {
        type: String,
        required : [true, "Please provide a unique email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique : false,
    },
    

});

const UserModel = model('Users', UserSchema)

export default UserModel;