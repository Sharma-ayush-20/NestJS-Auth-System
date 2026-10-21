import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LessonDocument = HydratedDocument<Lesson>

@Schema()
export class Lesson {
    
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    videoUrl: string

    @Prop({ default: 1, min: 1 })
    duration: number

    @Prop({ default: false })
    isFreePreview: boolean

}

export const LessonSchema = SchemaFactory.createForClass(Lesson)