import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MedalType {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  HONORABLE_MENTION = 'honorable_mention',
  NONE = 'none'
}

@Entity('competition_results')
export class CompetitionResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rank: number;

  @Column()
  name: string;

  @Column()
  school: string;

  @Column('float', { nullable: true })
  score: number;

  @Column({
    type: 'enum',
    enum: MedalType,
    default: MedalType.NONE
  })
  medal: MedalType;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}