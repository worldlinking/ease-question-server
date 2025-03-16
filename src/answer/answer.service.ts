import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Answer } from './shemas/answer.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name) private readonly answerModel: Model<Answer>,
  ) {}

  async create(answerInfo) {
    if (!answerInfo.questionId)
      throw new HttpException('缺少问卷Id', HttpStatus.BAD_REQUEST);
    const answer = new this.answerModel(answerInfo);
    return await answer.save();
  }

  //return count of questionId's answer
  async count(questionId: string) {
    if (!questionId) return 0;
    return await this.answerModel.countDocuments({ questionId });
  }

  //return answer list of questionId
  async findAll(questionId: string, opt: { page: number; pageSize: number }) {
    if (!questionId) return [];
    const { page = 1, pageSize = 10 } = opt;
    const list = await this.answerModel
      .find({ questionId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return list;
  }
}
