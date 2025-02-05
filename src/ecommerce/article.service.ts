import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schema/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
    constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

    async create(createArticleDto: CreateArticleDto): Promise<Article> {
        const newArticle = new this.articleModel(createArticleDto);
        return await newArticle.save();
    }

    async findAll(limit = 10, page = 1, category?: string): Promise<Article[]> {
        const skip = (page - 1) * limit;
        const filter = category ? { category } : {}; // If category is given, filter by category
        return await this.articleModel.find(filter).skip(skip).limit(limit).exec();
    }

    async findOne(id: string): Promise<Article> {
        const article = await this.articleModel.findById(id).exec();
        if (!article) {
            throw new NotFoundException('Product not found');
        }
        return article;
    }

    async update(id: string, updateArticleDto: UpdateArticleDto): Promise<Article> {
        const updatedArticle = await this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true });
        if (!updatedArticle) {
            throw new NotFoundException('Product not found');
        }
        return updatedArticle;
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.articleModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new NotFoundException('Product not found');
        }
    }
}
