import { Router } from "express";
import { PrismaClient } from '@prisma/client'

const router = Router();
const prisma = new PrismaClient();


router.post('/',async ( req, res ) => {
    const { email, name, userName } = req.body; 

    try {
        const result = await prisma.user.create({
            data: {
                email,
                name,
                userName, 
            }
        });
        res.json(result)
    } catch (error) {
        return res.status(400).json({err: error});
    }
});

router.get('/', async ( req, res) => {
    const allUser = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
        }
    });

    res.json({
        users: allUser,
    })
});

router.get('/:id',async ( req, res ) => {
    const {id} = req.params;
    const user = await prisma.user.findUnique({
        where: {
            id: Number(id),
        },
        include: {tweet : true},
    });

    if( !user ){
        return res.json({
            message: "user not found"
        })
    }

    return res.json(user);
});
 
router.put('/:id', async( req, res) => {
    const {id} = req.params;
    const data = req.body;

    try {
        const result = await prisma.user.update({
            where: {id: Number(id)},
            data: data,
        });

        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            err: error
        })
    }
})

router.delete('/:id', async( req, res)=>{
    const {id} = req.params
    const result = await prisma.user.delete({
        where: { id: Number(id) }
    });

    return res.json(result);
});

export default router; 