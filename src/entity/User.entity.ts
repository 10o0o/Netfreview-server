import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './Image.entity';
import { LikeReview } from './LikeReview.entity';
import { RefreshToken } from './RefreshToken.entity';
import { Review } from './Review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: null })
  profileUrl: string | null;

  @Column({ default: null })
  introduction: string | null;

  @Column()
  nickname: string;

  @Column()
  lastLogin: Date;

  @OneToOne(() => Image, (image) => image.user)
  image: Image;

  @OneToMany(() => LikeReview, (like) => like.user, { cascade: true })
  likeReview: LikeReview;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
