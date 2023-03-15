export class User {

    constructor(username: string, password: string, role: string = 'student', id: number = 0) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    id: number = 0;
    username: string = '';
    password: string = '';
    role: string = '';
    roleType: Role = Role.Student;
    token?: string;
}

export function equals(user1: User, user2: User): boolean {
    if (user1.id != user2.id)
        return false
    if (user1.username != user2.username)
        return false
    if (user1.role != user2.role)
        return false
    return true;
}

export interface Token {
    token: string
}

export interface UserToken {
    iat: number;
    user: User;
}

export enum Role {
    Student = 'student',
    Professor = 'professor',
    Admin = 'admin'
}