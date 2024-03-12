import { BaseEntity } from 'src/common/entities';
import { Restroom } from 'src/restrooms/entities/restroom.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'toilets' })
export class Toilet extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isOccupied: boolean;

  @ManyToOne(() => Restroom, (restroom) => restroom.toilets)
  restroom: Restroom;
}
