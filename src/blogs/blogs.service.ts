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

  async findAll(limit: number, page: number, location?: string): Promise<Blog[]> {
    let filter: any = {};
    
    if (location) {
      // If location is specified, get both global blogs and location-specific blogs
      filter.$or = [
        { location: null },           // Global blogs (no location)
        { location: location.toLowerCase() }  // Location-specific blogs
      ];
    }
    
    return this.blogModel.find(filter)
      .sort({ createdAt: -1 }) // Latest first
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
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

  async getBlogsByLocation(location: string, limit: number = 10, page: number = 1): Promise<Blog[]> {
    const filter = {
      $or: [
        { location: null },           // Global blogs
        { location: location.toLowerCase() }  // Location-specific blogs
      ]
    };
    
    return this.blogModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async getLocationSpecificBlogs(location: string, limit: number = 10, page: number = 1): Promise<Blog[]> {
    // Only get blogs with a specific location (exclude global ones)
    const filter = {
      location: location.toLowerCase()  // Only location-specific blogs
    };
    
    return this.blogModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async getGlobalBlogs(limit: number = 10, page: number = 1): Promise<Blog[]> {
    return this.blogModel.find({ location: null })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }
}
