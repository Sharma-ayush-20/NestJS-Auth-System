import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema.js';
import { Course } from '../../course/schemas/course.schema.js';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Course.name, required: true, index: true })
  courseId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5, default: 1 })
  ratings: number;

  @Prop({ required: false })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Guarantees at database level that 1 student can only review 1 course once!
ReviewSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
