import { BaseEntity } from 'src/common/entities';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum ToiletType {
  MEN = 'men',
  WOMEN = 'women',
  GENERAL = 'general',
  DISABLED = 'disabled',
}

@Entity({ name: 'toilets' })
export class Toilet extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ToiletType,
    default: ToiletType.GENERAL,
  })
  type: ToiletType;

  @Column({ default: false })
  isOccupied: boolean;

  @ManyToOne(() => User, (user) => user.toilets)
  user: User;
}
