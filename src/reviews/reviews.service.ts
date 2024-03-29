import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeReview } from 'src/entity/LikeReview.entity';
import { Review } from 'src/entity/Review.entity';
import { User } from 'src/entity/User.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { ReviewDto } from './dto/postReviewDto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(LikeReview)
    private likeRepository: Repository<LikeReview>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
  ) {
    this.reviewRepository = reviewRepository;
    this.likeRepository = likeRepository;
    this.userRepository = userRepository;
    this.videoRepository = videoRepository;
  }

  async getThisVidReviewAvgRate(videoId: number) {
    // 비디오 컨트롤러에서 평균 별점을 낼 때 사용하는 로직
    const thisVideo = await this.videoRepository.findOne({ id: videoId });
    const thisVidReviewList = await this.reviewRepository.find({
      video: thisVideo,
    });
    if (thisVidReviewList.length === 0) {
      return 0;
    }
    const count = thisVidReviewList.length;
    let sum = 0;
    thisVidReviewList.map((review) => {
      sum += review.rating;
    });

    return sum / count;
  }

  async addOrRemoveLike(user: User, review: Review) {
    const userLike = await this.likeRepository.findOne({ user, review });
    if (userLike) {
      await this.likeRepository.delete({ user, review });
      return Object.assign({
        message: 'Success deleted',
      });
    } else {
      const likeReview = new LikeReview();
      likeReview.user = user;
      likeReview.review = review;
      await this.likeRepository.save(likeReview);
      return Object.assign({
        message: 'Success created',
      });
    }
  }

  async findReviewWithId(reviewId: number) {
    return await this.reviewRepository.findOne({ id: reviewId });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async findThisVidAndUserReview(video: any, user) {
    if (user === 'guest') {
      user = await this.userRepository.findOne({ name: 'guest' });
    }
    const rawVideoList = await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where({ video })
      .getMany();
    const videoList = [];

    if (rawVideoList.length) {
      for (const review of rawVideoList) {
        delete review.user.password;
        const likeCount = await this.likeRepository.count({ review });
        const isLike = await this.likeRepository.count({ user, review });
        videoList.push({
          ...review,
          likeCount,
          isLike,
        });
      }
    } else {
      return { videoList, userReview: null };
    }

    const rawUserReview = await this.reviewRepository.findOne({ video, user });
    if (!rawUserReview) {
      return {
        videoList,
        userReview: null,
      };
    }

    const userReview = {
      ...rawUserReview,
      likeCount: await this.likeRepository.count({ review: rawUserReview }),
      isLike: await this.likeRepository.count({ user, review: rawUserReview }),
      reviewId: rawUserReview.id,
    };
    return { videoList, userReview };
  }

  async saveReview(user: User, video: Video, req: ReviewDto) {
    const isExist = await this.reviewRepository.findOne({ user, video });
    if (isExist) {
      throw new UnprocessableEntityException('이미 리뷰가 존재합니다!.');
    } else {
      const reviews = new Review();
      reviews.text = req.text;
      reviews.rating = req.rating;
      reviews.user = user;
      reviews.video = video;
      await this.reviewRepository.save(reviews);
      return Object.assign({
        message: '리뷰가 등록되었습니다.',
      });
    }
  }

  async deleteReview(id: number) {
    await this.reviewRepository.delete({ id: id });
  }

  async patchReview(user: User, video: Video, req: ReviewDto) {
    const review = await this.reviewRepository.findOne({ user, video });
    const id = review.id;
    await this.deleteReview(id);
    await this.reviewRepository.save({
      id,
      text: req.text,
      rating: req.rating,
      user,
      video,
    });
  }
}
