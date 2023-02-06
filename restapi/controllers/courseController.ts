import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getCourses = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.course.findMany();
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports = {
    getCourses
}