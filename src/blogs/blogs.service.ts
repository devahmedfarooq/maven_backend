import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Blog } from './schema/blog.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) { }


}
