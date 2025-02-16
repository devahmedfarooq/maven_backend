import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogController } from './blogs.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogScehema } from './schema/blog.schema';

@Module({
  controllers: [BlogController],
  providers: [BlogsService],
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogScehema }])]
})
export class BlogsModule { }
