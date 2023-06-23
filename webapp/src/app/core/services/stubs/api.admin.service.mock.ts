import { Course } from '@app/core/models/course.model';
import { Message } from '@app/core/models/message.model';
import { User } from '@app/core/models/user.model';
import { of } from 'rxjs';

export class ApiServiceStub {

    getUsers() {
        return of([
            { id: 2, username: "testUser1", role: "student"},
            { id: 3, username: "testUser2", role: "professor"},
        ])
    }

    getUser(id: number) {
        return of({ id: 2, username: "testUser1", role: "student"})
    }

    getCourse(id: number) {
        return of({ id: 1, name: "testCourse", description: "testDescription"})
    }

    getCourses() {
        return of([
            { id: 1, name: "testCourse1", description: "descriptionTest1"},
            { id: 2, name: "testCourse2", description: "descriptionTest2"},
        ])
    }

    createUser(user: User) {
        return of({message: "Test"})
    }

    updateUser(user: User) {
        return of({message: "Test"})
    }

    updateCourse(course: Course) {
        return of({message: "Test"})
    }

    createCourse(course: Course) {
        return of({message: "Test"})
    }

    deleteUser(id: number) {
        return of({message: "Test"})
    }

    deleteCourse(id: number) {
        return of({message: "Test"})
    }

    uploadUserFile(formData: FormData) {
        return of({message: "Test"})
    }

    uploadCourseFile(formData: FormData) {
        return of({message: "Test"})
    }
}