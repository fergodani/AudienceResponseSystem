export class Answer {

    constructor(description: string, is_correct: boolean) {
        this.description = description;
        this.is_correct = is_correct;
    }

    description: string='';
    is_correct: boolean=false;
}

