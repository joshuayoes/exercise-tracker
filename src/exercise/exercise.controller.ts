import { Body, Controller, Get, Post, Query } from "@nestjs/common";
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
}
