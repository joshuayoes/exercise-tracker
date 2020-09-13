import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserDto } from "../dtos/user.dto";
import { User } from "../schemas/user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findUserByUsername(username: string): Promise<UserDto[]> {
    const users = await this.userModel.find({ username });
    return users;
  }

  async findAllUsers(): Promise<UserDto[]> {
    const users = await this.userModel.find();
    return users;
  }

  async findUserById(_id: string): Promise<UserDto> {
    const user = await this.userModel.findById(_id);
    return user;
  }
}
