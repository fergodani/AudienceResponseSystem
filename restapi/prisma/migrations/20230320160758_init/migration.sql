-- CreateTable
CREATE TABLE "answerResult" (
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "question_index" INTEGER NOT NULL,
    "answered" BOOLEAN NOT NULL,

    CONSTRAINT "answerResult_pkey" PRIMARY KEY ("game_id","user_id")
);

-- AddForeignKey
ALTER TABLE "answerResult" ADD CONSTRAINT "answerResult_game_id_user_id_fkey" FOREIGN KEY ("game_id", "user_id") REFERENCES "gameResult"("game_id", "user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answerResult" ADD CONSTRAINT "answerResult_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
