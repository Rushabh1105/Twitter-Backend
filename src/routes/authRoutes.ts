import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const EMAIL_TOKEN_EXPIRATION_TIME = 10; //Minutes
const JWT_SECRET = "SUPER_SECRET";

function generateEmailToken(): string{
    return Math.floor(100000 + Math.random()*9000000).toString();
}

function generateAuthToken(tokenId: Number): String {
    const jwtPayload = { tokenId };

    return jwt.sign( jwtPayload, JWT_SECRET, {
        algorithm: "HS256",
        noTimestamp: true,
    })
}

router.post( '/login',async ( req, res ) => {
    const { email} = req.body;

    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_TIME*60*1000 );


    try {
        const createToken = await prisma.token.create({
            data: {
                type:"EMAIL",
                emailToken,
                expiration,
                user:{
                    connectOrCreate: {
                        where: { email },
                        create: { email }
                    }
                }
            }
        });
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400).json({
            message: "Something went wrong",
        });
    }

    
});

router.post('/authenticate', async( req, res ) => {
    const { email, emailToken } = req.body;

    const dbEmailToken = await prisma.token.findUnique({
        where: {
            emailToken,
        },
        include: {
            user: true
        }
    });
        
    if( !dbEmailToken || !dbEmailToken.valid ){
        return res.sendStatus(401).json({
            message: "unauthenticate",
        });
    }
    
    if( dbEmailToken.expiration < new Date() ){
    
        return res.sendStatus(401).json({
            message: "Token Expired"
        })
    }
    
    if( dbEmailToken?.user?.email != email ){
        return res.sendStatus(401);
    }
    
    const expiration = new Date(new Date().getTime() + 72*60*60*1000 );
    const apiToken = await prisma.token.create({
        data: {
            type: "API",
            expiration,
            user: {
                connect: {email},
            }
        }
    });
    
    await prisma.token.update({
        where: {id: dbEmailToken.id},
        data: {valid: false},
    })

    const authToken = generateAuthToken(apiToken.id);
    
    res.json({
        authToken,
    });
});


export default router;