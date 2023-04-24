import { Question } from "./question.model";
import { Survey } from "./survey.model";
import { User } from "./user.model";

export class Course {

    constructor(name: string, description: string, id: number = 0) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    id: number = 0;
    name: string='';
    description: string=''
}

export interface UserCourse {
    course_id: number;
    users: User[];
}

export interface SurveyCourse {
    course_id: number;
    surveys: Survey[];
}

export interface QuestionCourse {
    course_id: number;
    questions: Question[];
}