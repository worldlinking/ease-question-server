import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { Answer, AnswerSchema } from './shemas/answer.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
  exports: [AnswerService],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
