import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFindOptions } from "mongoose";
import { AddExerciseDto } from "../dtos/add-exercise.dto";
import { Exercise } from "../schemas/exercise.schema";
import { Schema as SchemaType } from "mongoose";
import { UserService } from "../user/user.service";

export type FindUserWithExercisesOptions = {
  userId: string;
  from?: string;
  to?: string;
  limit?: number;
};

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
    private userService: UserService,
  ) {}

  async findUserByIdWithExercises(options: FindUserWithExercisesOptions) {
    const { _id, username } = await this.userService.findUserById(
      options.userId,
    );
    const rawExercises = await this.findExercisesByUserId(
      options,
    );
    const log = rawExercises.map((
      { date, userId, description, duration },
    ) => ({ date, userId, description, duration }));

    return { _id, username, log };
  }

  async addExercise(addExerciseDto: AddExerciseDto) {
    const exercise = new this.exerciseModel(addExerciseDto);
    return exercise.save();
  }

  async findExercisesByUserId(
    options: FindUserWithExercisesOptions,
  ) {
    const { userId, from, to, limit } = options;
    const $gte = !!from ? from as unknown as SchemaType.Types.Date : undefined;
    const $lte = !!to ? to as unknown as SchemaType.Types.Date : undefined;
    const date = !!$lte || !!$gte
      ? {
        ...($gte && { $gte }),
        ...($lte && { $lte }),
      }
      : undefined;
    const queryOptions: QueryFindOptions = !!limit ? { limit } : undefined;

    const userExercises = this.exerciseModel.find(
      { userId, ...(date && { date }) },
      null,
      queryOptions,
    );
    return userExercises;
  }
}
