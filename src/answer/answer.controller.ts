import { Controller, Post, Body } from '@nestjs/common';
import { AnswerService } from './answer.service';
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  async create(@Body() answerInfo) {
    return this.answerService.create(answerInfo);
  }
}
