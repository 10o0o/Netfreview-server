import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LikeReview } from './LikeReview.entity';
import { User } from './User.entity';
import { Video } from './Video.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rating: number;

  @Column()
  text: string;

  @OneToMany(() => LikeReview, (like) => like.review, { cascade: true })
  likeReview: LikeReview;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Video, (video) => video.reviews, { onDelete: 'CASCADE' })
  video: Video;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
