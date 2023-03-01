import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getCourses = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.course.findMany();
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const createCourse = async (req: Request, res: Response): Promise<Response> => {
    try{
        const { name, description } = req.body
        const existingCourse = await prisma.course.findFirst({
            where: {
                name: name,
            },
        })
        if (existingCourse){
            return res.status(400).send("Course already exists")
        }
        let savedCourse: Prisma.courseCreateInput
        savedCourse = {
            name: name,
            description: description,
        }
        await prisma.course.create({data: savedCourse})
        return res.status(200).json("Course created")
    } catch (error) {
        return res.status(500).send(error)
    }
}

const updateCourse = async(req: Request, res: Response): Promise<Response> => {
    try{
        const {name, newName, newDescription } = req.body
        const course = await prisma.course.findFirst({
            where: {
                name: name,
            }
        })
        if(course == null){
            return res.status(404).json({message: "Course not found"})
        }
        await prisma.course.update({
            where: {
                name: name,
            },
            data: {
                name: newName,
                description: newDescription
            }
        })
        return res.status(404).json({message: req.body.name + " course updated"})
    } catch (error) {
        return res.status(500)
    }
}

const deleteCourse = async (req: Request, res: Response): Promise<Response> => {
    try{
        await prisma.course.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        return res.status(200).json({message : req.body.name + " course deleted"})
    } catch (error) {
        return res.status(500)
    }
}

module.exports = {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
}