import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ads, AdsSchema } from './schema/ads.schema';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [MongooseModule.forFeature([{ name: Ads.name, schema: AdsSchema }])]
})
export class AdminModule { }
