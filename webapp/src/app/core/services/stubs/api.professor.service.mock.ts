import { Survey } from "@app/core/models/survey.model";
import { of } from "rxjs";

export class ApiProfessorServiceStub {
    getQuestionsByUser(userId: number) {
        return of([
            {
                id: 1,
                description: "question 1",
                answers: [
                    {
                        description: "answer 1 1",
                        is_correct: true
                    },
                    {
                        description: "answer 1 2",
                        is_correct: false
                    }
                ]
            },
            {
                id: 2,
                description: "question 2",
                answers: [
                    {
                        description: "answer 2 1",
                        is_correct: true
                    },
                    {
                        description: "answer 2 2",
                        is_correct: false
                    }
                ]
            }
        ])
    }

    getSurveysByUser(userId: number) {
        return of([
            {
                title: "TitleTest1",
            },
            {
                title: "TitleTest2",
            },
            {
                title: "TitleTest3",
            }
        ])
    }

    deleteQuestion(questionId: number) {
        return of({message: "Test"})
    }

    importQuestions(){
        return of({message: "Test"})
    }

    createQuestion(){
        return of({message: "Test"})
    }

    createSurvey(survey: Survey) {
        return of({message: "Test"})
    }

    getUsersByCourse() {
        return of([])
    }

    getSurveysByCourse() {
        return of([])
    }

    getQuestionsByCourse() {
        return of([])
    }

    getGamesByCourse() {
        return of([])
    }

    getGameResultByGame() {
        return of([])
    }

    getGameResultsByGame() {
        return of([])
    }

    getGameById() {
        return of()
    }
}