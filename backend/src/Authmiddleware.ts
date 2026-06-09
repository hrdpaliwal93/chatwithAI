import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"

export default function Authmiddleware  (req:Request,res:Response,next:NextFunction){
  let token  = req.headers.authorization?.split(" ")[1] 
  if(token){
    try{
      let data = jwt.verify(token, `${process.env.jwt_secret}` ) as JwtPayload
      req.id = data.id
      next()
    }catch(e){
      res.json({message:"invalid or expired token", success:false})
    }


  }else{
    res.json({message:"not logged in", success:false})
  }



}