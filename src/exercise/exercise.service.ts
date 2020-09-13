import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddExerciseDto } from "src/dtos/add-exercise.dto";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { Exercise } from "src/schemas/exercise.schema";
import { User } from "src/schemas/user.schema";

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

  async addExercise(addExerciseDto: AddExerciseDto) {
    const exercise = new this.exerciseModel(addExerciseDto);
    return exercise.save();
  }

  async findExercisesByUserId(userId: string) {
    const userExercises = this.exerciseModel.find({ userId });
    return userExercises;
  }
}
