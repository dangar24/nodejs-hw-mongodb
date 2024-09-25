import { Schema, model } from "mongoose";
import { emailRegexp } from '../../constants/user.js';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    });

const User = model('user', userSchema);

export default User;