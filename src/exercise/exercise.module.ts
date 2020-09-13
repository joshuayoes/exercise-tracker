import { Module } from "@nestjs/common";
import { ExerciseService } from "./exercise.service";
import { ExerciseController } from "./exercise.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [ExerciseService],
  controllers: [ExerciseController],
})
export class ExerciseModule {}
