import { Point } from 'geojson';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
  OneToMany,
  DeleteDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User, UserId } from '../users/User';
import { Tag } from './tag/Tag';
import { Image } from '../upload/Image';
import { error } from '../utils/error';

export type PlantId = number;

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Plant extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
    id: PlantId;

  @Index({ fulltext: true })
  @Column()
    name: string;

  @Column({
    scale: 2,
    precision: 6,
    type: 'decimal',
    unsigned: true,
    nullable: true,
  })
    price: number;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: true,
  })
    amount?: number;

  @Column({ default: false })
    swap: boolean;

  @Column({ default: false })
    donate: boolean;

  @Index({ fulltext: true })
  @Column({ nullable: true })
    description?: string;

  @Column()
    state: string;

  @Column()
    city: string;

  @Column()
    card: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
  })
  @Index({ spatial: true })
    location: Point;

  // @BeforeUpdate()
  // @BeforeInsert()
  // checkAvailabilities() {
  //   if (!this.price && !this.swap && !this.donate) {
  //     error(400, 'Plant with no price or swap or donate');
  //   }
  // }

  @ManyToMany(() => Tag)
  @JoinTable()
    tags: Tag[];

  @Column()
    userId: UserId;

  @ManyToOne(() => User, (user) => user.plants, { nullable: false })
    user: User;

  @ManyToMany(() => User, (user) => user.likedPlants, { nullable: false })
  @JoinTable()
    likedBy: User[];

  @OneToMany(() => Image, (image) => image.plant, { onDelete: 'CASCADE' })
    images: Image[];

  @CreateDateColumn()
    createdAt: Timestamp;

  @UpdateDateColumn()
    updatedAt: Timestamp;

  @DeleteDateColumn({ select: false })
    deletedAt?: Date;

  liked?:boolean;

  alsoSaw?: Plant[];
}
