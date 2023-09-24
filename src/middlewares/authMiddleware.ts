import  { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from "@prisma/client";
import { type } from "os";



const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";


const prisma = new PrismaClient();

type AuthRequest = Request & {user?: User }; 


export async function authToken( req:AuthRequest, res:Response, next:NextFunction ) {
    const token = req.headers['authorization'];
    // console.log(authHeader);

    if( !token ){
        return res.json({
            message: "Unauthorised"
        });
    }


    try {
        const payload = ( await jwt.verify( token, JWT_SECRET )) as {
            tokenId: number;
        };
        

        const dbToken = await prisma.token.findUnique({
            where: { id: payload.tokenId },
            include: { user: true }
        });

        if( !dbToken?.valid ){
            return res.json({
                erroor: "Something went wrong",
            })
        }

        
        if( dbToken.expiration < new Date() ){
            return res.json({
                error: "Please Sign in again",
            })
        }


        req.user = dbToken.user;

    } catch (error) {
        console.log(error)
        return res.json({
            err: error
        })
    }

    next();
}