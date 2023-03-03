import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client'
import multiparty = require('multiparty');
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import * as csv_format from '@fast-csv/format';
import { User } from '../models/user.model';
import { Course } from '../models/course.model';
const prisma = new PrismaClient()

const getCourses = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.course.findMany();
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

const getCourse = async (req: Request, res: Response): Promise<Response> => {
    try{
        let result = await prisma.course.findFirst({
            where: {
                id: Number(req.params.id),
            },
        })
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
        const {id, name, description } = req.body
        const course = await prisma.course.findFirst({
            where: {
                id: Number(id),
            }
        })
        if(course == null){
            return res.status(404).json({message: "Course not found"})
        }
        const newName = name != "" ? name : course.name;
        const newDescription = description != "" ? description : course.description;
        await prisma.course.update({
            where: {
                id: Number(id),
            },
            data: {
                name: newName,
                description: newDescription
            }
        })
        return res.status(404).json({message: req.body.name + " course updated"})
    } catch (error) {
        return res.status(500).send(error)
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

const uploadCourseFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const form = new multiparty.Form({ uploadDir: '../restapi/files' });
        form.parse(req, function (err, fields, files) {
            fs.rename(files.file[0].path, process.env.FILEPATH!, function (err) {
                if (err) console.log('ERROR: ' + err);
            });
            fs.createReadStream(path.resolve(process.env.FILEPATH!))
                .pipe(csv.parse({ headers: true }))
                .on('error', error => console.error(error))
                .on('data', row => {
                    addCourse(row)
                })
                .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
        });

        return res.status(200).json({ message: "File read successful" })
    } catch (error) {
        return res.status(500).send(error)
    }
}

async function addCourse(course: Course) {
    try{
        const existingCourse = await prisma.course.findFirst({
            where: {
                name: course.name,
            },
        })
        if (existingCourse){
            return
        }
        let savedCourse: Prisma.courseCreateInput
        savedCourse = {
            name: course.name,
            description: course.description,
        }
        await prisma.course.create({data: savedCourse})
    } catch (error) {
       return
    }
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCourseFile
}