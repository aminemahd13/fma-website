import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamMemberService } from '../services/team-member.service';
import { CreateTeamMemberDto } from '../dto/create-team-member.dto';
import { UpdateTeamMemberDto } from '../dto/update-team-member.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';
import { ADMIN_ROLE } from 'src/constants';
import { TeamMember } from '../entities/team-member.entity';

@Controller('mtym-api/team-members')
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  create(@Body() createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember> {
    return this.teamMemberService.create(createTeamMemberDto);
  }

  @Get()
  @Public()
  findAllActive(): Promise<TeamMember[]> {
    return this.teamMemberService.findAllActive();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  findAll(): Promise<TeamMember[]> {
    return this.teamMemberService.findAll();
  }

  @Get('category/:category')
  @Public()
  findByCategory(@Param('category') category: string): Promise<TeamMember[]> {
    return this.teamMemberService.findAllByCategory(category);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<TeamMember> {
    return this.teamMemberService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  update(@Param('id') id: string, @Body() updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember> {
    return this.teamMemberService.update(+id, updateTeamMemberDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(ADMIN_ROLE)
  remove(@Param('id') id: string): Promise<void> {
    return this.teamMemberService.remove(+id);
  }
}