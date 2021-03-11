import { LikeReview } from 'src/entity/LikeReview.entity';
import { Review } from 'src/entity/Review.entity';
import { User } from 'src/entity/User.entity';
import { Video } from 'src/entity/Video.entity';
import { Repository } from 'typeorm';
import { ReviewDto } from './dto/postReviewDto';
export declare class ReviewsService {
    private reviewRepository;
    private likeRepository;
    private userRepository;
    private videoRepository;
    constructor(reviewRepository: Repository<Review>, likeRepository: Repository<LikeReview>, userRepository: Repository<User>, videoRepository: Repository<Video>);
    getThisVidReviewAvgRate(videoId: number): Promise<any>;
    addOrRemoveLike(user: User, review: Review): Promise<any>;
    findReviewWithId(reviewId: number): Promise<Review>;
    findThisVidAndUserReview(video: any, user: any): Promise<{
        videoList: any[];
        userReview: {
            likeCount: number;
            isLike: number;
            reviewId: number;
            id: number;
            rating: number;
            text: string;
            likeReview: LikeReview;
            user: User;
            video: Video;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    saveReview(user: User, video: Video, req: ReviewDto): Promise<any>;
    deleteReview(id: number): Promise<void>;
    patchReview(user: User, video: Video, req: ReviewDto): Promise<any>;
}
