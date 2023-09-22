import { Router } from "express";
import {PrismaClient} from '@prisma/client'

const router = Router();
const prisma = new PrismaClient;

router.post( '/',async ( req, res ) => {
    const { content, userId, image } = req.body;
    const id = Number(userId);
 
    try {
        const result = await prisma.tweet.create({
            data: {
                content,
                userId: id,
                image,
            }
        });
        return res.json(result);
    } catch (error) {
        console.log(error)
        return res.json({
            err: error
        })
    }
});

router.get('/',async ( req, res ) => {
    const allTweets = await prisma.tweet.findMany({ 
        // include: {user: true },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    userName: true,
                }
            }
        }
    });
    return res.json(allTweets);
});

router.get('/:id',async ( req, res ) => {
    const {id} = req.params;

    const result = await prisma.tweet.findUnique({
        where:{
            id: Number(id),
        }
    });
    if( !result ){
        return res.json({
            message: "tweet not found",
        })
    }
    return res.json(result);
});

// router.put('/:id')

router.delete('/:id',async (req, res ) => {
    const {id} = req.params;
    const result = await prisma.tweet.delete({
        where: {
            id: Number(id),
        }
    });

    return res.json(result)
});

export default router;