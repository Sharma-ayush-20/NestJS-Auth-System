import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { courseLevel } from "../course.type.js";
import { HydratedDocument, Types } from "mongoose";
import { User } from "../../user/schemas/user.schema.js";

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

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    instructorId: Types.ObjectId

} 

export const CourseSchema = SchemaFactory.createForClass(Course)
