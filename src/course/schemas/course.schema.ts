import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { courseLevel } from "../course.type.js";
import { HydratedDocument } from "mongoose";

export type CourseDocument = HydratedDocument<Course> 

@Schema({ timestamps: true })
export class Course {

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true, enum: courseLevel })
    level: courseLevel

    @Prop({ required: true })
    price: number

} 

export const CourseSchema = SchemaFactory.createForClass(Course)
