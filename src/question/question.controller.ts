import {
  Controller,
  Get,
  Delete,
  Query,
  Param,
  Body,
  Post,
  Patch,
  Request,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Request() req) {
    const { username } = req.user;
    return this.questionService.create(username);
  }

  @Post('ai')
  createByAI(@Request() req, @Body('title') title: string) {
    const { username } = req.user;
    return this.questionService.createByAI(username, title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('isDelete') isDelete: boolean = false,
    @Query('isStar') isStar: boolean,
    @Request() req,
  ) {
    const { username } = req.user;
    const list = await this.questionService.findAllList({
      keyword,
      page,
      pageSize,
      isDelete,
      isStar,
      author: username,
    });
    const count = await this.questionService.countAll({
      keyword,
      isDelete,
      isStar,
      author: username,
    });
    return {
      list,
      count,
    };
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateData: QuestionDto,
    @Request() req,
  ) {
    const { username } = req.user;
    return this.questionService.update(id, updateData, username);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.questionService.delete(id, username);
  }

  @Delete()
  deleteMany(@Body() body, @Request() req) {
    const { username } = req.user;
    const { ids = [] } = body;
    return this.questionService.deleteMany(ids, username);
  }

  @Post('duplicate/:id')
  duplicate(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.questionService.duplicate(id, username);
  }
}
