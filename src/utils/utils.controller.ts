import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) { }

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.utilsService.imageUpload(file)
  }
}
