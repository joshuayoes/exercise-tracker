import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "src/dtos/create-user.dto";
import { User } from "src/schemas/user.schema";

@Injectable()
export class ExerciseService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }
}
