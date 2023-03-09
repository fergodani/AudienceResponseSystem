export interface User{
    id: number;
    username: string;
    password: string;
    role: string;
    roleType: Role;
    token?:string;
}

export enum Role {
    Student = 'student',
    Professor = 'professor',
    Admin = 'admin'
}