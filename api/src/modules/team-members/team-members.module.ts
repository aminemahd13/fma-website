import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberService } from './services/team-member.service';
import { TeamMemberController } from './controllers/team-member.controller';
import { TeamMembersSeederService } from './services/team-members-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember])],
  controllers: [TeamMemberController],
  providers: [TeamMemberService, TeamMembersSeederService],
  exports: [TeamMemberService],
})
export class TeamMembersModule implements OnModuleInit {
  constructor(private readonly seederService: TeamMembersSeederService) {}

  async onModuleInit() {
    // Seed the database with initial team members data
    await this.seederService.seed();
  }
}