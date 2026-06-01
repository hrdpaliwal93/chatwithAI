import mongoose, { mongo } from "mongoose";



const userSchema = new mongoose.Schema({
    name:String
    
})
const roomSchema = new mongoose.Schema({
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