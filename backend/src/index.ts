import dotenv from 'dotenv'
dotenv.config()
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({port:8000})
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
