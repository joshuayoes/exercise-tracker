import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryFindOptions } from "mongoose";
import { AddExerciseDto } from "src/dtos/add-exercise.dto";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { Exercise } from "src/schemas/exercise.schema";
import { User } from "src/schemas/user.schema";
import { Schema as SchemaType } from "mongoose";

export type FindUserWithExercisesOptions = {
  userId: string;
  from?: string;
  to?: string;
  limit?: number;
};

@Injectable()
export class ExerciseService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findUser(username: string) {
    const users = await this.userModel.find({ username });
    return users;
  }

  async findUserById(_id: string) {
    const user = await this.userModel.findById(_id);
    return user;
  }

  async findUserByIdWithExercises(options: FindUserWithExercisesOptions) {
    const { _id, username } = await this.findUserById(options.userId);
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
