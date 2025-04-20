import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompetitionResultService } from '../services/competition-result.service';
import { CreateCompetitionResultDto } from '../dto/create-competition-result.dto';
import { UpdateCompetitionResultDto } from '../dto/update-competition-result.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';
import { ADMIN_ROLE } from 'src/constants';
import { CompetitionResult } from '../entities/competition-result.entity';

@Controller('mtym-api/competition-results')
export class CompetitionResultController {
  constructor(private readonly competitionResultService: CompetitionResultService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  create(@Body() createCompetitionResultDto: CreateCompetitionResultDto): Promise<CompetitionResult> {
    return this.competitionResultService.create(createCompetitionResultDto);
  }

  @Get()
  @Public()
  findAllActive(): Promise<CompetitionResult[]> {
    return this.competitionResultService.findAllActive();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  findAll(): Promise<CompetitionResult[]> {
    return this.competitionResultService.findAll();
  }

  // Move the update-all-active route before the :id route to ensure proper route matching
  @Patch('update-all-active')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  async updateAllActive(@Body() body: { isActive: boolean }): Promise<{ success: boolean }> {
    await this.competitionResultService.updateAllActive(body.isActive);
    return { success: true };
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<CompetitionResult> {
    return this.competitionResultService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  update(@Param('id') id: string, @Body() updateCompetitionResultDto: UpdateCompetitionResultDto): Promise<CompetitionResult> {
    return this.competitionResultService.update(+id, updateCompetitionResultDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  remove(@Param('id') id: string): Promise<void> {
    return this.competitionResultService.remove(+id);
  }
}