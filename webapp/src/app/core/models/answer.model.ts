export class Answer {

    constructor(description: string, is_correct: boolean, id: number = 0) {
        this.id = id;
        this.description = description;
        this.is_correct = is_correct;
    }

    id?: number;
    description: string='';
    is_correct: boolean=false;
}

