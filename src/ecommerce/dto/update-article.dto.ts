import { PartialType } from "@nestjs/mapped-types";
import { CreateArticleDto } from "./create-article.dto";
import { IsOptional } from "class-validator";

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
    @IsOptional()
    quantity?: number;
}
