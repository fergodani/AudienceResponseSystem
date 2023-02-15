import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getGame = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.game.findMany()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports = {
    getGame
}