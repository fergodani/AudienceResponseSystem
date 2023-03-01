export class Course {

    constructor(name: string, description: string, id: number = 0) {
        this.name = name;
        this.description = description;
    }

    id: number = 0;
    name: string='';
    description: string=''
}