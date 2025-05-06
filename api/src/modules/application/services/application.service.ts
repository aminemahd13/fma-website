import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationStatusService } from './application-status.service';

@Injectable()
export class ApplicationService {
  constructor(
    private userService: UserService,
    private applicationStatusService: ApplicationStatusService,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(createApplicationDto: CreateApplicationDto, userId: number) {
    // Find user first
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    // Check if user already has an application
    if (user.application) {
      throw new Error(`User with id ${userId} already has an application`);
    }

    // Create application
    const application = this.applicationRepository.create(createApplicationDto);
    
    // Set user relationship properly
    application.user = user;
    
    // Save application with user relationship
    await this.applicationRepository.save(application);

    // Create application status
    const applicationStatus = await this.applicationStatusService.create(application);
    application.status = applicationStatus;
    
    // Save application with status
    await this.applicationRepository.save(application);
    
    // Update user to reference this application
    await this.userService.update(user.id, { application });

    return application;
  }

  findAll() {
    return this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.status', 'status')
      .leftJoinAndSelect('application.user', 'user')
      .getMany();
  }

  findOneById(id: number) {
    return this.applicationRepository
      .createQueryBuilder('application')
      .where('application.id = :id', { id })
      .leftJoinAndSelect('application.status', 'status')
      .getOne();
  }

  findOneByUserId(userId: number) {
    return this.applicationRepository
      .createQueryBuilder('application')
      .where('application.userId = :userId', { userId })
      .leftJoinAndSelect('application.status', 'status')
      .getOne();
  }

  update(id: number, updateApplicationDto: UpdateApplicationDto) {
    return this.applicationRepository.update({ id }, updateApplicationDto);
  }

  delete(id: number) {
    return this.applicationRepository.delete({ id });
  }
}
