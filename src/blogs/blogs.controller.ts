import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from './schema/blog.schema';

@Controller('blogs')
export class BlogController {
  constructor(private readonly BlogsService: BlogsService) {}

  @Post()
  async create(@Body() blogData: Blog): Promise<Blog> {
    return this.BlogsService.create(blogData);
  }

  @Get()
  async findAll(): Promise<Blog[]> {
    return this.BlogsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Blog | null> {
    const blog = await this.BlogsService.findOne(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() blogData: Blog): Promise<Blog | null> {
    const updatedBlog = await this.BlogsService.update(id, blogData);
    if (!updatedBlog) {
      throw new NotFoundException('Blog not found');
    }
    return updatedBlog;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Blog | null> {
    const deletedBlog = await this.BlogsService.remove(id);
    if (!deletedBlog) {
      throw new NotFoundException('Blog not found');
    }
    return deletedBlog;
  }
}
