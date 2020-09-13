import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AddExerciseDto } from "src/dtos/add-exercise.dto";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { ExerciseService } from "./exercise.service";

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
    const users = await this.exerciseService.findUser(username);
    return users;
  }

  @Post("add")
  async addExercise(@Body() addExerciseDto: AddExerciseDto) {
    const { description, duration, userId, date: rawDate } = addExerciseDto;
    const date = rawDate !== "" ? rawDate : undefined;
    const request = { description, duration, userId, date };

    await this.exerciseService.addExercise(request);

    const { _id, username } = await this.exerciseService.findUserById(userId);
    const rawExercises = await this.exerciseService.findExercisesByUserId(
      userId,
    );
    const exercises = rawExercises.map((
      { date, userId, description, duration },
    ) => ({ date, userId, description, duration }));

    return { _id, username, exercises };
  }
}
