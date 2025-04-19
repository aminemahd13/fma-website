import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from '../entities/team-member.entity';
import { CreateTeamMemberDto } from '../dto/create-team-member.dto';
import { UpdateTeamMemberDto } from '../dto/update-team-member.dto';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  async create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember> {
    const teamMember = this.teamMemberRepository.create(createTeamMemberDto);
    return this.teamMemberRepository.save(teamMember);
  }

  async findAll(): Promise<TeamMember[]> {
    return this.teamMemberRepository.find({
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findAllActive(): Promise<TeamMember[]> {
    return this.teamMemberRepository.find({
      where: { isActive: true },
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findAllByCategory(category: string): Promise<TeamMember[]> {
    return this.teamMemberRepository.find({
      where: { 
        category,
        isActive: true 
      },
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<TeamMember> {
    const teamMember = await this.teamMemberRepository.findOne({ where: { id } });
    
    if (!teamMember) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }
    
    return teamMember;
  }

  async update(id: number, updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember> {
    const teamMember = await this.findOne(id);
    
    Object.assign(teamMember, updateTeamMemberDto);
    
    return this.teamMemberRepository.save(teamMember);
  }

  async remove(id: number): Promise<void> {
    const result = await this.teamMemberRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }
  }
}