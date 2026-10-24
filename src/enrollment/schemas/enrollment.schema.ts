import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "../../user/schemas/user.schema.js";
import { Course } from "../../course/schemas/course.schema.js";
import { EnrollmentStatus } from "../types/enrollment.status.type.js";

export type EnrollmentDocument = HydratedDocument<Enrollment>

@Schema({ timestamps: true })
export class Enrollment {

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    studentId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: Course.name, required: true, index: true })
    courseId: Types.ObjectId;

    @Prop({ default: EnrollmentStatus.ACTIVE, enum: EnrollmentStatus, type: String })
    status: EnrollmentStatus

    // Array of lesson ObjectIds completed by this student
    @Prop({ default: [], type: [{ type: Types.ObjectId }] })
    completedLessons: Types.ObjectId[];

    @Prop({ type: Number, default: 0, min: 0, max: 100 })
    progress: number

    // When the course was 100% completed (for certificates)
    @Prop({ type: Date, default: null })
    completedAt: Date

}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment)

// Prevents a student from enrolling in the same course twice! -> compound Unique indexing
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });