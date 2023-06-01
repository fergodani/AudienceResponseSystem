import { answer } from "@prisma/client";
import { Answer } from "./answer.model";

export interface Question{
    id?: number;
    description: string;
    subject: string;
    type: string;
    answer_time: number;
    answers: Answer[] | answer[];
    resource?: string;
    user_creator_id?: number;
    position?: number;
}

export interface QuestionSurvey {
    question_id: number;
    survey_id: number;
    position: number;
    question?: Question;
}

export interface QuestionCsv {
    descripcion: string;
    tema: string,
    tipo: string;
    tiempo: number;
    respuesta1: string;
    correcta1: string;
    respuesta2?: string;
    correcta2?: string;
    respuesta3?: string;
    correcta3?: string;
    respuesta4?: string;
    correcta4?: string;
}
