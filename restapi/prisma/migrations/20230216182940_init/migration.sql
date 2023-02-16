-- AlterTable
CREATE SEQUENCE answer_id_seq;
ALTER TABLE "answer" ALTER COLUMN "id" SET DEFAULT nextval('answer_id_seq');
ALTER SEQUENCE answer_id_seq OWNED BY "answer"."id";

-- AlterTable
CREATE SEQUENCE course_id_seq;
ALTER TABLE "course" ALTER COLUMN "id" SET DEFAULT nextval('course_id_seq');
ALTER SEQUENCE course_id_seq OWNED BY "course"."id";

-- AlterTable
CREATE SEQUENCE question_id_seq;
ALTER TABLE "question" ALTER COLUMN "id" SET DEFAULT nextval('question_id_seq');
ALTER SEQUENCE question_id_seq OWNED BY "question"."id";
