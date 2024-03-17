import { BaseEntity } from 'src/common/entities';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Toilet } from 'src/toilets/entities/toilet.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

export enum RestroomType {
  MEN = 'men',
  WOMEN = 'women',
  GENERAL = 'general',
  DISABLED = 'disabled',
}

@Entity({ name: 'restrooms' })
export class Restroom extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  floor: number;

  @Column({
    type: 'enum',
    enum: RestroomType,
    default: RestroomType.GENERAL,
  })
  type: RestroomType;

  @OneToMany(() => Toilet, (toilet) => toilet.restroom)
  toilets: Toilet[];

  @ManyToOne(() => Organization, (organization) => organization.restrooms)
  organization: Organization;

  constructor(partial: Partial<Restroom>) {
    super();
    Object.assign(this, partial);
  }
}
