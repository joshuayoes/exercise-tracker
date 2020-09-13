import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AddExerciseDto } from "src/dtos/add-exercise.dto";
import { CreateUserDto } from "src/dtos/create-user.dto";
import {
  ExerciseService,
  FindUserWithExercisesOptions,
} from "./exercise.service";

@Controller("exercise")
export class ExerciseController {
  constructor(private exerciseService: ExerciseService) {}

  @Post("new-user")
  async newUser(@Body() createUserDto: CreateUserDto) {
    const { username, _id } = await this.exerciseService.createUser(
      createUserDto,
    );
    return { username, _id };
  }

  @Get("users")
  async getUsers(@Query("username") username: string) {
    if (username) {
      const usersWithUsername = await this.exerciseService.findUserByUsername(
        username,
      );
      return usersWithUsername;
    }

    const users = await this.exerciseService.findAllUsers();
    return users;
  }

  @Post("add")
  async addExercise(@Body() addExerciseDto: AddExerciseDto) {
    const { description, duration, userId, date: rawDate } = addExerciseDto;
    const date = rawDate !== "" ? rawDate : undefined;
    const request = { description, duration, userId, date };

    const exercise = await this.exerciseService.addExercise(request);
    const user = await this.exerciseService.findUserById(userId);

    return {
      _id: user._id,
      username: user.username,
      duration: Number(exercise.duration),
      date: exercise.date,
      description: exercise.description,
    };
  }

  @Get("log")
  async logExercises(@Query() query: FindUserWithExercisesOptions) {
    const request = {
      ...query,
      ...(!!query.limit && {
        limit: Number(query.limit),
      }),
    };

    const userWithExercises = await this.exerciseService
      .findUserByIdWithExercises(request);

    const response = {
      ...userWithExercises,
      count: userWithExercises.log.length,
    };
    return response;
  }
}
