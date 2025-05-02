import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';
import { ItemsModule } from './items/items.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { UtilsModule } from './utils/utils.module';
import { BlogsModule } from './blogs/blogs.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: async () => {
      return {
        uri: "mongodb://localhost:27017/maven"
      }
    }
  }), AuthModule, AdminModule, UsersModule, BookingModule, ItemsModule, EcommerceModule, UtilsModule, BlogsModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService/* , RedisService */],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
