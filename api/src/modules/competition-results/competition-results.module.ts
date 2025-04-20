import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionResult } from './entities/competition-result.entity';
import { CompetitionResultService } from './services/competition-result.service';
import { CompetitionResultController } from './controllers/competition-result.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitionResult])],
  controllers: [CompetitionResultController],
  providers: [CompetitionResultService],
  exports: [CompetitionResultService],
})
export class CompetitionResultsModule {} 