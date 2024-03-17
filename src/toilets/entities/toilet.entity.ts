import { Column, Entity, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from 'src/common/entities';
import { Restroom } from 'src/restrooms/entities/restroom.entity';

@Entity({ name: 'toilets' })
export class Toilet extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isOccupied: boolean;

  @Column()
  @Exclude()
  token: string;

  @ManyToOne(() => Restroom, (restroom) => restroom.toilets)
  restroom: Restroom;

  constructor(partial: Partial<Toilet>) {
    super();
    Object.assign(this, partial);
  }
}
