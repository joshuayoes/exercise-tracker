import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AddExerciseDto } from "../dtos/add-exercise.dto";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserDto } from "../dtos/user.dto";
import { UserService } from "../user/user.service";
import {
  ExerciseService,
  FindUserWithExercisesOptions,
} from "./exercise.service";

export type AddExerciseResponse = Omit<AddExerciseDto, "userId"> & UserDto;

@Controller("exercise")
export class ExerciseController {
  constructor(
    private exerciseService: ExerciseService,
    private userService: UserService,
  ) {}

  @Post("new-user")
  async newUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const { username, _id } = await this.userService.createUser(
      createUserDto,
    );
    return { username, _id };
  }

  @Get("users")
  async getUsers(@Query("username") username?: string): Promise<UserDto[]> {
    if (username) {
      const usersWithUsername = await this.userService.findUserByUsername(
        username,
      );
      return usersWithUsername;
    }

    const users = await this.userService.findAllUsers();
    return users;
  }

  @Post("add")
  async addExercise(
    @Body() addExerciseDto: AddExerciseDto,
  ): Promise<AddExerciseResponse> {
    const { description, duration, userId, date: rawDate } = addExerciseDto;
    const date = rawDate !== "" ? rawDate : undefined;
    const request = { description, duration, userId, date };

    const exercise = await this.exerciseService.addExercise(request);
    const user = await this.userService.findUserById(userId);

    return {
      _id: user._id,
      username: user.username,
      duration: Number(exercise.duration),
      date: new Date(`${exercise.date}`).toDateString(),
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
