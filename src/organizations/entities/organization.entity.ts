import { BaseEntity } from 'src/common/entities';
import { Restroom } from 'src/restrooms/entities/restroom.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  address: string;

  @Column()
  password: string;

  @OneToMany(() => Restroom, (restroom) => restroom.organization)
  restrooms: Restroom[];

  @ManyToOne(() => User, (user) => user.organizations)
  user: User;
}
