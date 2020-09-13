import { Module } from "@nestjs/common";
import { ExerciseService } from "./exercise.service";
import { ExerciseController } from "./exercise.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";
import { Exercise, ExerciseSchema } from "src/schemas/exercise.schema";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Exercise.name, schema: ExerciseSchema },
      ],
    ),
    UserModule,
  ],
  providers: [ExerciseService, UserService],
  controllers: [ExerciseController],
})
export class ExerciseModule {}
