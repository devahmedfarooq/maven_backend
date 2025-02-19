import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schema/blog.schema';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

  async create(blogData: Blog): Promise<Blog> {
    const newBlog = new this.blogModel(blogData);
    return newBlog.save();
  }

  async findAll(limit: number, page: number): Promise<Blog[]> {
    return this.blogModel.find().skip((page - 1) * limit).limit(limit).exec();
  }

  async findOne(id: string): Promise<Blog | null> {
    return this.blogModel.findById(id).exec();
  }

  async update(id: string, blogData: Blog): Promise<Blog | null> {
    return this.blogModel.findByIdAndUpdate(id, blogData, { new: true }).exec();
  }

  async remove(id: string): Promise<Blog | null> {
    return this.blogModel.findByIdAndDelete(id).exec();
  }
}
