import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'

import { WebSocketServer } from "ws";
import express from 'express';
import http from 'http';

import { userModel, roomModel } from '../db.js';

import Authmiddleware from './Authmiddleware.js';
import { customAlphabet } from 'nanoid';
import mongoose from 'mongoose';


const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server})

app.use(express.json());



app.post('/signup', async (req,res)=>{
    const {username, password} = req.body;
    try{
         await  userModel.create({
        username,password
    })
    res.json({message:"sign up successful ", success:true})

    }catch(e){
        console.error(e)
    }

})


app.post('/login',async (req,res)=>{
    const {username, password}  = req.body
    try{
        const user = await  userModel.findOne({username, password})
    if(user){
        let token =jwt.sign({id:user._id.toString()}, `${process.env.jwt_secret}`)
        res.json({message:"logged in ", success:true, token:token})
    }else{
        res.json({message:"invalid login credentials", success:false})
    }
    }catch(e){
        console.error(e)    }
})



app.post('/create', Authmiddleware , async (req, res)=>{
    const { roomName, isPublic, limit} :{roomName:string, isPublic:boolean, limit:number} = req.body;
    const id = req.id
    if(id){
        await  roomModel.create({
        roomID:customAlphabet('ABCDEFGHIJKLMNOPQURSTUVWXYZ0123456789', 6)(),
        roomName,
        isPublic,
        limit,
        created_by:id

    })
    }else {
        res.json({message:"not authorized", success:false})
    }
   
    


})

let count = 0;
wss.on('connection', (socket)=>{
    count++;
    socket.send("user connected "+"#"+count);

    socket.on('message', async (data)=>{
        let finalResponse="";
        if(data.toString().includes("@ai")) {
            
            const request = data.toString().replace('ai', ' ').trim();
            
            const res= await fetch('https://api.groq.com/openai/v1/chat/completions', {
                headers:{
                    Authorization:`Bearer ${process.env.AI_API_KEY}`
                    
                },
                method:'POST',
                body:JSON.stringify({
                      "model": "llama-3.3-70b-versatile",
                      "messages":[
                        {
                            "role":"user",
                            "content":request
                        }
                      ]})
                 
            })

            const response = await res.json();
            finalResponse=response.choices[0].message.content
        }
        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN && ( finalResponse!=""? {}:client!=socket)){
                client.send(data.toString())
                if(finalResponse!="") client.send(finalResponse)
            }
        })
    })




})

server.listen(8000)