import { Course } from "@app/core/models/course.model";
import { of } from "rxjs";

export class ApiStudentServiceStub {

    getCoursesByUser(userId: number) {
        return of([
            { id: 1, name: "testCourse1", description: "descriptionTest1" },
            { id: 2, name: "testCourse2", description: "descriptionTest2" },
        ])
    }

    getOpenOrStartedGamesByCourses(courses: Course[]) {
        return of([
            { id: 1, survey: { title: "Tema1" } },
            { id: 2, survey: { title: "Tema2" } }
        ])
    }

    getGamesResultsByUser(userId: number) {
        return of([
            { game: { course: { name: "SO" }, survey: { title: "Tema1" } }, score: 1000 },
            { game: { course: { name: "ASR" }, survey: { title: "Tema2" } }, score: 1500 },
        ])
    }

    getGamesResultsByUserAndCourse(user_id: number, courseId: number) {
        return of([
            {
                game: {
                    course: { name: "SO" }, survey: { title: "Tema1" }
                },
                score: 1000,
                game_id: 1,
                user_id: 1,
                correct_questions: 1,
                wrong_questions: 1,
                total_questions: 2
            },
            {
                game: {
                    course: { name: "SO" }, survey: { title: "Tema2" }
                },
                score: 1500,
                game_id: 2,
                user_id: 1,
                correct_questions: 2,
                wrong_questions: 0,
                total_questions: 2
            },
        ])
    }

    getGamesResultByUserAndGame(user_id: number, game_id: number) {
        return of(
            {
                game: {
                    course: { name: "SO" },
                    survey: {
                        title: "Tema1",
                        questionsSurvey: [
                            {
                                question: {
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
                                }
                            },
                            {
                                question: {
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
                            }
                        ]
                    }
                },
                score: 1000,
                game_id: 1,
                user_id: 1,
                correct_questions: 1,
                wrong_questions: 1,
                answer_results: [
                    {
                        question_id: 1,
                        answer: {
                            description: "answer 1 1",
                            is_correct: true
                        }
                    },
                    {
                        question_id: 2,
                        answer: {
                            description: "answer 2 2",
                            is_correct: false
                        }
                    }
                ]
            }
        )
    }

}