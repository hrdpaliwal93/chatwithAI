import mongoose, { model } from "mongoose";



const userSchema = new mongoose.Schema({
    username:{type:String, required:true},
    password:{type:String, unique:true, required:true}
    
})
const roomSchema = new mongoose.Schema({
    roomID:{type:String , unique:true,  required:true},
    roomName:{type:String},
    created_by:{type:mongoose.Types.ObjectId, required:true, ref:'User'},
    limit:{type:Number, default:0},
    isPublic:{type:Boolean , required:true}
    
})
const message_status = ['sent','received']
const messageSchema = new mongoose.Schema({
    roomID : {type:mongoose.Types.ObjectId, required:true, ref:'Room'},
    senderID:{type:mongoose.Types.ObjectId, required:true, ref:'User'},
    message_body: {type:String},
    timestamp:{type:Date},
    status:{type:String,enum:message_status , required:true}
})


export const userModel = model('User', userSchema)
export const roomModel = model('Room', roomSchema)
export const messageModel = model('Message', messageSchema)

