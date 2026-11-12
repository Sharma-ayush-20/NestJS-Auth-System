import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "../../user/schemas/user.schema.js";
import { Course } from "../../course/schemas/course.schema.js";

export type CertificateDocument = HydratedDocument<Certificate>

@Schema({ timestamps: true })
export class Certificate {

    @Prop({ required: true, unique: true, index: true })
    certificateId: string

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    studentId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: Course.name, required: true, index: true })
    courseId: Types.ObjectId

    @Prop({ required: true })
    pdfUrl: string

    @Prop({ type: Date, default: Date.now })
    issuedAt: Date

}

export const CertificateSchema = SchemaFactory.createForClass(Certificate)

//use compound Index
CertificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true })