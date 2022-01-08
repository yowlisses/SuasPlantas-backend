import {
  Column,
  Entity,
  ManyToOne,
  Timestamp,
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User, UserId } from '../users/User';
import { Plant, PlantId } from '../plants/Plant';

type LikeId = number;

@Entity({ name: 'likes' })
@Unique(['plantId', 'userId'])
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
    id: LikeId;

  @ManyToOne(() => User, (user) => user.likes, { nullable: false })
    user: User;

  @Column()
    userId: UserId;

  @ManyToOne(() => Plant, (plant) => plant.likes, { nullable: false })
    plant: Plant;

  @Column()
    plantId: PlantId;

  @Unique(['plantId', 'userId'])

  @CreateDateColumn()
    createdAt: Timestamp;
}