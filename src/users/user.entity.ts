import { BaseEntity } from 'src/shared/entities';
import { Column, Entity, Index } from 'typeorm';

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
}
