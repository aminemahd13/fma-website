import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompetitionResult } from '../entities/competition-result.entity';
import { CreateCompetitionResultDto } from '../dto/create-competition-result.dto';
import { UpdateCompetitionResultDto } from '../dto/update-competition-result.dto';

@Injectable()
export class CompetitionResultService {
  constructor(
    @InjectRepository(CompetitionResult)
    private competitionResultRepository: Repository<CompetitionResult>,
  ) {}

  async create(createCompetitionResultDto: CreateCompetitionResultDto): Promise<CompetitionResult> {
    const competitionResult = this.competitionResultRepository.create(createCompetitionResultDto);
    return this.competitionResultRepository.save(competitionResult);
  }

  async findAll(): Promise<CompetitionResult[]> {
    return this.competitionResultRepository.find({
      order: {
        rank: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findAllActive(): Promise<CompetitionResult[]> {
    return this.competitionResultRepository.find({
      where: { isActive: true },
      order: {
        rank: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<CompetitionResult> {
    const competitionResult = await this.competitionResultRepository.findOne({ where: { id } });
    
    if (!competitionResult) {
      throw new NotFoundException(`Competition result with ID ${id} not found`);
    }
    
    return competitionResult;
  }

  async update(id: number, updateCompetitionResultDto: UpdateCompetitionResultDto): Promise<CompetitionResult> {
    const competitionResult = await this.findOne(id);
    
    Object.assign(competitionResult, updateCompetitionResultDto);
    
    return this.competitionResultRepository.save(competitionResult);
  }

  async remove(id: number): Promise<void> {
    const result = await this.competitionResultRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Competition result with ID ${id} not found`);
    }
  }

  async updateAllActive(isActive: boolean): Promise<void> {
    await this.competitionResultRepository.update({}, { isActive });
  }
}