import mongoose, {Schema, Document, Models} from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    messages: Message[];
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpire: Date;
    isAcceptingMessage: boolean;
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema: Schema<User> = new Schema({
    username :{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [emailRegex, "Invalid email format"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    messages: [messageSchema],
    verifyCode: {
        type: String,
        required: true,
        default: () => Math.random().toString(36).substr(2, 6)
    },
    isVerified: {
        type: Boolean,
         default: false
    },
    verifyCodeExpire: {
        type: Date,
        required: true,
        default: () => Date.now() + 60 * 60 * 1000 // 1 hour
    }
});

// Next js run at edge time it can't be know db is connected or not connected so 
// first we check if the db is connected and second we connect to db;

const UserModal = ( mongoose.models.User as mongoose.Model<User> )
                 || ( mongoose.model<User>("User", userSchema) );

export default UserModal;