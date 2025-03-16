import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
  timestamps: true, //记录时间戳
})
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop({ required: true })
  author: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isStar: boolean;

  @Prop({ default: false })
  isDelete: boolean;

  @Prop({
    default: false,
  })
  isHidden: boolean;

  @Prop({
    default: false,
  })
  isLocked: boolean;

  @Prop()
  componentList: {
    fe_id: string;
    type: string;
    title: string;
    isHidden: boolean;
    isLocked: boolean;
    props: object;
  }[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
