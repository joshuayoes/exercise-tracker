import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as SchemaType } from "mongoose";

@Schema()
export class Exercise extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  description: string;

  @Prop(
    {
      default: new Date().toISOString().slice(0, 10),
      type: SchemaType.Types.Date,
    },
  )
  date: SchemaType.Types.Date;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
