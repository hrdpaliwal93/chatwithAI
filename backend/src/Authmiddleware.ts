import type { Request, Response, NextFunction } from "express";


export default function Authmiddleware(req:Request,res:Response,next:NextFunction){
  let token  = req.headers.authorization?.split(" ")[1] 

  
  
}