import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Exercise } from "../schemas/exercise.schema";
import { User } from "../schemas/user.schema";
import { UserService } from "../user/user.service";
import { ExerciseController } from "./exercise.controller";
import { ExerciseService } from "./exercise.service";

describe("ExerciseController", () => {
  let controller: ExerciseController;
  let exerciseService: ExerciseService;
  let userService: UserService;

  const userModel = {
    username: "Joshua",
    _id: "some-random-uuid",
  };
  const exerciseModel = {
    userId: "some-random-uuid",
    duration: 10,
    description: "biking",
    date: "2020-09-13",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseController],
      providers: [ExerciseService, UserService, {
        provide: getModelToken(User.name),
        useValue: userModel,
      }, {
        provide: getModelToken(Exercise.name),
        useValue: exerciseModel,
      }],
    }).compile();

    controller = module.get<ExerciseController>(ExerciseController);
    userService = module.get<UserService>(UserService);
    exerciseService = module.get<ExerciseService>(ExerciseService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should have defined /new-user POST route", () => {
    expect(controller.newUser).toBeDefined();
  });

  it("should return /new-user POST route that returns user model", async () => {
    const result = Promise.resolve(userModel) as Promise<User>;
    jest.spyOn(userService, "createUser").mockImplementation(() => result);

    expect(await controller.newUser(userModel)).toStrictEqual(userModel);
  });
});
