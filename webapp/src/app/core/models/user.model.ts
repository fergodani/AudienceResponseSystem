export class User {

    constructor(username: string, password: string, role: string = 'student', id: number = 0) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    id: number = 0;
    username: string='';
    password: string='';
    role: string='';
}

export interface Token {
    token: string
}

export interface UserToken {
    iat: number;
    user: User;
}