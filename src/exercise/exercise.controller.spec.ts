import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { UserDto } from "../dtos/user.dto";
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
    const result: Promise<UserDto> = Promise.resolve(userModel);
    jest.spyOn(userService, "createUser").mockImplementation(() => result);

    expect(await controller.newUser(userModel)).toStrictEqual(userModel);
  });

  it("should have defined /users GET route", () => {
    expect(controller.getUsers).toBeDefined();
  });

  it("should return /users GET route that returns list of users", async () => {
    const users: UserDto[] = [userModel, userModel, userModel];
    const result = Promise.resolve(users);

    jest.spyOn(userService, "findUserByUsername").mockImplementation(() =>
      result
    );
    jest.spyOn(userService, "findAllUsers").mockImplementation(() => result);

    expect(await controller.getUsers("username")).toStrictEqual(users);
    expect(await controller.getUsers()).toStrictEqual(users);
  });

  it("should have defined /add POST route", () => {
    expect(controller.addExercise).toBeDefined();
  });

  it("should return /add POST route that returns added exercise response", async () => {
    const { duration, description, date } = exerciseModel;

    const response = {
      duration,
      description,
      date: new Date(date).toDateString(),
      ...userModel,
    };

    jest.spyOn(exerciseService, "addExercise").mockImplementation(() =>
      Promise.resolve(exerciseModel as unknown as Exercise)
    );
    jest.spyOn(userService, "findUserById").mockImplementation(() =>
      Promise.resolve(userModel)
    );

    expect(await controller.addExercise(exerciseModel)).toEqual(response);
  });

  it("should have defined /log GET route", () => {
    expect(controller.logExercises).toBeDefined();
  });
});
