export class Answer {

    constructor(description: string, isCorrect: boolean, id: number = 0) {
        this.description = description;
        this.isCorrect = isCorrect;
        this.id = id;
    }

    id: number = 0;
    description: string='';
    isCorrect: boolean=false;
}

export enum Type {
    multioption,
    true_false,
    short
  }