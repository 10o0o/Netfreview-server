"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const reviews_service_1 = require("../reviews/reviews.service");
const users_service_1 = require("../users/users.service");
const videos_service_1 = require("./videos.service");
const token_service_1 = require("../auth/token.service");
let VideosController = class VideosController {
    constructor(videosService, reviewsService, usersService, tokenService) {
        this.videosService = videosService;
        this.reviewsService = reviewsService;
        this.usersService = usersService;
        this.tokenService = tokenService;
        this.videosService = videosService;
        this.reviewsService = reviewsService;
        this.usersService = usersService;
        this.tokenService = tokenService;
    }
    async test() {
        await this.videosService.saveDummyVideo();
    }
    async getVideoList(path, q, req) {
        if (path === 'myPage') {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new common_1.UnauthorizedException('로그인 후 이용 가능합니다.');
            }
            const { user } = await this.tokenService.resolveRefreshToken(req.cookies.refreshToken);
            const videoList = await this.videosService.getUserVideo(user.id);
            return Object.assign({
                videoList: videoList,
            });
        }
        else if (path === 'aboutThis') {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new common_1.UnauthorizedException('로그인 후 이용 가능합니다.');
            }
            const { user } = await this.tokenService.resolveRefreshToken(refreshToken);
            const userId = user.id;
            const videoList = await this.videosService.getUserVideo(userId);
            if (!videoList || videoList.length === 0) {
                const videoList2 = await this.videosService.getAllVideoWithReview();
                const videoBox = [];
                for (const video of videoList2) {
                    const avgRating = await this.reviewsService.getThisVidReviewAvgRate(video.id);
                    videoBox.push(Object.assign(Object.assign({}, video), { rating: avgRating }));
                }
                videoBox.sort((a, b) => b.rating - a.rating);
                const top5Vidbox = videoBox.slice(0, 5);
                return Object.assign({
                    top5VideoList: top5Vidbox,
                    message: '유저의 리뷰가 없어서 메인페이지 top5 비디오리스트를 보냄',
                });
            }
            const videoIds = [];
            for (const video of videoList) {
                videoIds.push(video.id);
            }
            const aboutThisVid = await this.videosService.getUserAboutThis(videoIds, userId);
            return Object.assign({
                videoList: aboutThisVid,
            });
        }
        else if (path === 'main') {
            const videoList = await this.videosService.getAllVideoWithReview();
            const videoBox = [];
            for (const video of videoList) {
                const avgRating = await this.reviewsService.getThisVidReviewAvgRate(video.id);
                videoBox.push(Object.assign(Object.assign({}, video), { rating: avgRating }));
            }
            videoBox.sort((a, b) => b.rating - a.rating);
            const top5Vidbox = videoBox.slice(0, 5);
            videoBox.sort((a, b) => b.reviews.length - a.reviews.length);
            const mostReviewVid = videoBox.slice(0, 5);
            const notMostReviewVid = videoBox.slice(videoBox.length - 5, videoBox.length);
            return Object.assign({
                top5VideoList: top5Vidbox,
                mostReviewVidList: mostReviewVid,
                lessReviewVidList: notMostReviewVid,
                message: '메인페이지 비디오 리스트 모음',
            });
        }
        if (q) {
            const allVideolist = await this.videosService.getSearchVideo(q);
            return Object.assign({
                videoList: allVideolist,
            });
        }
        else {
            throw new common_1.BadRequestException('잘못된 경로의 요청입니다. Path를 확인해주세요');
        }
    }
    async getThisVideo(videoId) {
        const rawVideoData = await this.videosService.findVidWithId(videoId);
        const avgRating = await this.reviewsService.getThisVidReviewAvgRate(videoId);
        if (!rawVideoData)
            throw new common_1.BadRequestException('해당 비디오가 없습니다.');
        const genres = await this.videosService.getThisVidGenreWithId(videoId);
        const genreBucket = [];
        for (const genre of genres) {
            genreBucket.push(genre.name);
        }
        return Object.assign(Object.assign(Object.assign({}, rawVideoData), { rating: avgRating, genres: genreBucket }));
    }
    async addVideo(body, req) {
        const user = req.user;
        const admin = await this.usersService.findUserWithName('admin');
        delete admin.password;
        if (user.id === admin.id && user.email === admin.email) {
            return await this.videosService.addThisVideo(body);
        }
        else {
            throw new common_1.UnauthorizedException('허가되지 않은 사용자입니다.');
        }
    }
};
__decorate([
    common_1.Post('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "test", null);
__decorate([
    common_1.Get('/videolist'),
    __param(0, common_1.Query('path')),
    __param(1, common_1.Query('q')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getVideoList", null);
__decorate([
    common_1.Get(':videoId'),
    __param(0, common_1.Param('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getThisVideo", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post('add'),
    __param(0, common_1.Body()), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "addVideo", null);
VideosController = __decorate([
    common_1.Controller('videos'),
    __metadata("design:paramtypes", [videos_service_1.VideosService,
        reviews_service_1.ReviewsService,
        users_service_1.UsersService,
        token_service_1.TokenService])
], VideosController);
exports.VideosController = VideosController;
//# sourceMappingURL=videos.controller.js.map