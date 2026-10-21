import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Lesson, LessonSchema } from "./lesson.schema.js";

export type ModuleDocument = HydratedDocument<Module>

@Schema({ timestamps: true})
export class Module {

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    description: string

    @Prop({ type: [LessonSchema], default: [] })
    lessons: Lesson[]

}

export const ModuleSchema = SchemaFactory.createForClass(Module)