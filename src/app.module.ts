import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ExerciseModule } from "./exercise/exercise.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config/dist/config.module";
import { ConfigService } from "@nestjs/config/dist/config.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("DB_URI"),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      exclude: ["/api*"],
    }),
    ExerciseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
