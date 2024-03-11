import { BaseEntity } from 'src/common/entities';
import { Toilet } from 'src/toilets/entities/toilet.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Toilet, (toilet) => toilet.user)
  toilets: Toilet[];
}
