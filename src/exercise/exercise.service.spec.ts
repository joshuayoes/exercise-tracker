import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Exercise } from "../schemas/exercise.schema";
import { User } from "../schemas/user.schema";
import { UserService } from "../user/user.service";
import { ExerciseService } from "./exercise.service";

describe("ExerciseService", () => {
  let service: ExerciseService;
  class MongooseMock {
    constructor(private data) {}

    save = jest.fn().mockResolvedValue(this.data);
    find = jest.fn().mockResolvedValue(this.data);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseService, UserService, {
        provide: getModelToken(Exercise.name),
        useValue: MongooseMock,
      }, {
        provide: getModelToken(User.name),
        useValue: MongooseMock,
      }],
    }).compile();

    service = module.get<ExerciseService>(ExerciseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
