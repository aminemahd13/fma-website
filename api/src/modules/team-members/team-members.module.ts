import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberService } from './services/team-member.service';
import { TeamMemberController } from './controllers/team-member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember])],
  controllers: [TeamMemberController],
  providers: [TeamMemberService],
  exports: [TeamMemberService],
})
export class TeamMembersModule {}