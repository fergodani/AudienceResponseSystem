-- CreateTable
CREATE TABLE "gameResult" (
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "gameResult_pkey" PRIMARY KEY ("game_id","user_id")
);

-- AddForeignKey
ALTER TABLE "gameResult" ADD CONSTRAINT "gameResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gameResult" ADD CONSTRAINT "gameResult_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
