import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { Team } from '../entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/modules/user/services/user.service';
import { SerializedUser } from 'src/modules/user/entities/serialized-user';
import { TeamAccessCodeService } from './team-access-code.service';

@Injectable()
export class TeamService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @Inject(forwardRef(() => TeamAccessCodeService))
    private teamAccessCodeService: TeamAccessCodeService,
  ) {}

  async create(createTeamDto: CreateTeamDto, userId: number) {
    const team = await this.teamRepository.create(createTeamDto);
    const leader = await this.userService.findOneById(userId);
    team.leader = new SerializedUser(leader);
    team.users = []; // Initialize empty users array

    return this.teamRepository.save(team);
  }

  findAll() {
    return this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.leader', 'leader')
      // Removed the team.users join since it's no longer a DB relationship
      .getMany()
      .then(teams => {
        // Initialize empty users array for each team
        return teams.map(team => {
          team.users = [];
          return team;
        });
      });
  }

  findOneById(id: number) {
    return this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.leader', 'leader')
      // Removed the team.users join since it's no longer a DB relationship
      .where('team.id = :id', { id })
      .getOne()
      .then(team => {
        if (team) {
          team.users = []; // Initialize empty users array
        }
        return team;
      });
  }

  findOneByName(name: string) {
    return this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.leader', 'leader')
      // Removed the team.users join since it's no longer a DB relationship
      .where('team.name = :name', { name })
      .getOne()
      .then(team => {
        if (team) {
          team.users = []; // Initialize empty users array
        }
        return team;
      });
  }

  // This method is simplified since we don't actually store users in teams anymore
  async addUser(id: number, userId: number) {
    const user = await this.userService.findOneById(userId);
    const team = (await this.findOneById(id)) as Team;
    if (!user || !team) {
      throw new NotFoundException('The user or team does not exist');
    }
    
    // Since we're removing the functionality, we'll just return without modifying anything
    return;
  }

  // This method is simplified since we don't actually store users in teams anymore
  async removeUser(id: number, userId: number) {
    const team = (await this.findOneById(id)) as Team;
    if (!team) {
      throw new NotFoundException('The team does not exist');
    }
    
    // Since we're removing the functionality, we'll just return without modifying anything
    return;
  }

  async changeLeader(teamId: number, newLeaderId: number) {
    const team = (await this.findOneById(teamId)) as Team;
    if (!team) {
      throw new NotFoundException('The team does not exist');
    }

    const user = await this.userService.findOneById(newLeaderId);
    if (!user) {
      throw new NotFoundException('The chosen new leader does not exist');
    }

    team.leader = user;
    await this.teamRepository.save(team);
    return;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.teamRepository.update({ id }, updateTeamDto);
  }

  async delete(id: number) {
    const deleteTeamAccessCodes = await this.teamAccessCodeService.deleteByTeam(
      id,
    );
    console.log('deleteTeamAccessCodes', deleteTeamAccessCodes);
    return this.teamRepository.delete({ id });
  }
}
