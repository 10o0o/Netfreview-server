import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeReview } from 'src/entity/LikeReview.entity';
import { Review } from 'src/entity/Review.entity';
import { UsersModule } from 'src/users/users.module';
import { VideosModule } from 'src/videos/videos.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, LikeReview]),
    UsersModule,
    VideosModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
