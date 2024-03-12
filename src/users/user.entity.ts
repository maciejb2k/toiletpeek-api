import { BaseEntity } from 'src/common/entities';
import { Organization } from 'src/organizations/entities/organization.entity';
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

  @OneToMany(() => Organization, (organization) => organization.user)
  organizations: Organization[];
}
