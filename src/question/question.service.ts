import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { QuestionDto } from './dto/question.dto';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import OpenAI from 'openai';

const openai = new OpenAI({
  // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
  apiKey: 'sk-c5b2d5c7315042b1852d1e7e65f413cf',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

const dayjs = require('dayjs');

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async create(username: string) {
    const formattedDate = dayjs().format('YYYY年M月D日 HH:mm');
    const question = new this.questionModel({
      title: '问卷标题' + formattedDate,
      desc: '问卷描述',
      author: username,
      componentList: {
        fe_id: nanoid(),
        type: 'questionInfo',
        title: '问卷信息',
        props: { title: '问卷标题', desc: '问卷描述' },
      },
    });
    return await question.save();
  }

  async createByAI(username: string, title: string) {
    const completion = await openai.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content:
            '你是一个问卷生成助手。请根据用户输入的问卷主题生成一段JSON格式的组件配置信息列表，组件配置信息有7种可选项，QuestionTitleProps { text?: string; level?: 1 | 2 | 3 | 4 | 5; isCenter?: boolean;}，对应type为questionTitle；QuestionInputProps { title?: string; placeholder?: string;}，对应type为questionInput；QuestionTextareaProps{ title?: string; placeholder?: string;}，对应type为questionTextarea；QuestionRadioProps { title?: string; options?: { value: string; label: string;}[]; value?: string; isVertical?: boolean;}，对应type为questionRadio；QuestionParagraphProps { text?: string; isCenter?: boolean;}，对应type为questionParagraph；QuestionInfoProps { title?: string; desc?: string;}，对应type为questionInfo；QuestionCheckboxProps { title?: string; isVertical?: boolean; list?: { value: string; label: string; checked: boolean;}[];}，对应type为questionCheckbox；组件列表的格式为componentList: { fe_id: string; type: string; title: string; isHidden: boolean; isLocked: boolean; props: object; }[];其中fe_id为nanoid格式，type为组件类型，title为组件标题,isHidden为是否隐藏,isLocked为是否锁定，props为组件配置信息。根据问卷主题生成包含5个组件配置的列表',
        },
        { role: 'user', content: `问卷主题为：${title}问卷` },
      ],
    });

    const contentString = completion.choices[0].message.content;
    const cleanedString = contentString?.replace(/```json\n|\n```/g, '');
    const jsonData = JSON.parse(cleanedString || '{}');

    const formattedDate = dayjs().format('YYYY年M月D日 HH:mm');
    const question = new this.questionModel({
      title: '问卷标题' + formattedDate,
      desc: '问卷描述',
      author: username,
      componentList: jsonData.componentList,
    });
    return await question.save();
  }

  async update(id: string, updateData: QuestionDto, author: string) {
    return await this.questionModel.updateOne({ _id: id, author }, updateData);
  }

  async delete(id: string, author: string) {
    return await this.questionModel.findOneAndDelete({ _id: id, author });
  }

  async deleteMany(ids: string[], author: string): Promise<any> {
    return await this.questionModel.deleteMany({
      _id: { $in: ids },
      author,
    });
  }

  async findOne(id: string) {
    return await this.questionModel.findById(id);
  }

  async findAllList({
    keyword = '',
    page = 1,
    pageSize = 10,
    isDelete = false,
    isStar,
    author = '',
  }) {
    const whereOpt: any = {
      author,
      isDelete,
    };

    if (isStar != null) whereOpt.isStar = isStar;
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg }; //模糊搜索
    }
    return await this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 }) //逆序
      .skip((page - 1) * pageSize) //分页
      .limit(pageSize);
  }

  async countAll({ keyword = '', isDelete = false, isStar, author = '' }) {
    const whereOpt: any = {
      author,
      isDelete,
    };
    if (isStar != null) whereOpt.isStar = isStar;
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg }; //模糊搜索
    }
    return await this.questionModel.countDocuments(whereOpt);
  }

  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findById(id);
    const newQuestion = new this.questionModel({
      ...question?.toObject(),
      _id: new mongoose.Types.ObjectId(),
      title: question?.title + ' - 复制',
      author,
      isStar: false,
      isPublished: false,
      componentList: question?.componentList.map((item) => ({
        ...item,
        fe_id: nanoid(),
      })),
    });
    return await newQuestion.save();
  }
}
