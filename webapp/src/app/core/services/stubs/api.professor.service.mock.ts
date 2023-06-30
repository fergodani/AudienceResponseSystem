import { Game } from "@app/core/models/game.model";
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
                id: 1,
                title: "TitleTest1",
            },
            {
                id: 2,
                title: "TitleTest2",
            },
            {
                id: 3,
                title: "TitleTest3",
            }
        ])
    }

    deleteQuestion(questionId: number) {
        return of({message: "Test"})
    }

    deleteSurvey(questionId: number) {
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
        return of([{username: "user1", rol: "student"}, {username: "user2", rol: "student"}])
    }

    getSurveysByCourse() {
        return of([
            {
                title: "survey1",
            },
            {
                title: "survey2",
            }
        ])
    }

    getGamesByCourse() {
        return of([
            {
               id: 1,
               survey: {
                title: "game1"
               } 
            },
            {
                id: 2,
                survey: {
                 title: "game2"
                } 
             }
        ])
    }

    getGameResultByGame() {
        return of([])
    }

    getGameResultsByGame() {
        return of([
            {
                user: { username: "testUser1"},
                score: 1000,
                correct_questions: 2,
                wrong_questions: 2,
                total_questions: 4,
            },
            {
                user: { username: "testUser2"},
                score: 2000,
                correct_questions: 3,
                wrong_questions: 0,
                total_questions: 4,
            }
        ])
    }

    getGameById() {
        return of({id: 1})
    }

    createGame(game: Game) {
        return of({id: 1})
    }

    updateGame() {
        return of({})
    }

    getQuestionsByCourse(courseId: number){
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
}