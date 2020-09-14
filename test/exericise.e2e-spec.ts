import * as request from "supertest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { ExerciseModule } from "../src/exercise/exercise.module";
import { ExerciseService } from "../src/exercise/exercise.service";
import { UserService } from "../src/user/user.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "../src/schemas/user.schema";
import { Exercise } from "../src/schemas/exercise.schema";
import { ExerciseController } from "../src/exercise/exercise.controller";

const user = {
  username: "Joshua",
  _id: "some-random-uuid",
};

const exercise = {
  userId: "some-random-uuid",
  duration: 10,
  description: "biking",
  date: "2020-09-13",
};

describe("Exercise module", () => {
  let app: INestApplication;
  const userService = { createUser: () => user };
  const exerciseService = { addExercise: () => {} };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExerciseService, UserService],
      controllers: [ExerciseController],
    })
      .overrideProvider(ExerciseService)
      .useValue(exerciseService)
      .overrideProvider(UserService)
      .useValue(userService)
      .overrideProvider(getModelToken(User.name))
      .useValue(user)
      .overrideProvider(getModelToken(Exercise.name))
      .useValue(exercise)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`POST /api/exercise/new-user`, () => {
    return request(app.getHttpServer())
      .post("/exercise/new-user")
      .send({ username: "Joshua" })
      .expect(201)
      .expect({
        ...userService.createUser(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
