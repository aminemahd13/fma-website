import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus } from './application-status.entity';

@Entity({ name: 'applications' })
export class Application {
  constructor(partial: Partial<Application>) {
    Object.assign(this, partial);
  }

  /* Personal Informations */
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.application)
  @JoinColumn()
  user: User;

  @OneToOne(
    () => ApplicationStatus,
    (applicationStatus) => applicationStatus.application,
  )
  @JoinColumn()
  status: ApplicationStatus;

  @Column({ type: 'varchar', default: '' })
  firstName: string;

  @Column({ type: 'varchar', default: '' })
  lastName: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', default: '' })
  massarCode: string;

  @Column({ type: 'varchar', default: '' })
  city: string;

  @Column({ type: 'varchar', default: '' })
  region: string;

  @Column({ type: 'varchar', default: '' })
  phoneNumber: string;

  @Column({ type: 'varchar', default: '' })
  guardianFullName: string;

  @Column({ type: 'varchar', default: '' })
  parentCNIE: string;

  @Column({ type: 'varchar', default: '' })
  guardianPhoneNumber: string;

  @Column({ type: 'varchar', default: '' })
  relationshipWithGuardian: string;

  @Column({ type: 'text', nullable: true })
  specialConditions: string;

  /* Education */
  @Column({ type: 'varchar', default: '' })
  highschool: string;

  @Column({ type: 'varchar', default: '' })
  averageGrade: string;

  @Column({ type: 'varchar', default: '' })
  physicsAverageGrade: string;

  @Column({ type: 'varchar', default: '' })
  ranking: string;

  @Column({ type: 'varchar', default: '' })
  physicsRanking: string;


  /* Competition */
  @Column({ type: 'varchar', default: '' })
  hasPreviouslyParticipated: string;

  @Column({ type: 'text', nullable: true })
  previousCompetitions: string;

  @Column({ type: 'varchar', default: '' })
  physicsOlympiadsParticipation: string;

  @Column({ type: 'varchar', default: '' })
  olympiadsTrainingSelection: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  /* Files */
  @Column({ type: 'varchar', nullable: true })
  parentIdUrl: string;

  @Column({ type: 'varchar', nullable: true })
  birthCertificateUrl: string;

  @Column({ type: 'varchar', nullable: true })
  schoolCertificateUrl: string;

  @Column({ type: 'varchar', nullable: true })
  gradesUrl: string;

  @Column({ type: 'varchar', nullable: true })
  regulationsUrl: string;

  @Column({ type: 'varchar', nullable: true })
  parentalAuthorizationUrl: string;

  @Column({ type: 'varchar', nullable: true })
  imageRightsUrl: string;
  
  @Column({ type: 'varchar', nullable: true })
  reportUrl: string;

  /* createAt & updatedAt */
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
