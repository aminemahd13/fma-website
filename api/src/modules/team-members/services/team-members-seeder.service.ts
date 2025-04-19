import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from '../entities/team-member.entity';

const initialTeamData = [
  // Organizing Committee
  {
    name: 'Ismail BOUHAJ',
    imageSrc: '/organizing-team/ismail_bouhaj.jpeg',
    linkedinSrc: 'https://linkedin.com/in/ismail-bouhaj-240745235',
    category: 'organizingCommittee',
    order: 1
  },
  {
    name: 'Omar BENNOUNA',
    imageSrc: '/organizing-team/omar_bennouna.jpeg',
    linkedinSrc: 'https://linkedin.com/in/omar-bennouna-a6b64b197',
    category: 'organizingCommittee',
    order: 2
  },
  {
    name: 'Lina BELLAHMIDI',
    imageSrc: '/organizing-team/lina_bellahmidi.jpeg',
    linkedinSrc: 'https://linkedin.com/in/lina-bellahmidi-0b1251248',
    category: 'organizingCommittee',
    order: 3
  },
  {
    name: 'Mohammed-Younes GUEDDARI',
    imageSrc: '/organizing-team/mohammed_younes_gueddari.jpeg',
    linkedinSrc: 'https://linkedin.com/in/mohammed-younes-gueddari-4299b6147',
    category: 'organizingCommittee',
    order: 4
  },
  {
    name: 'Manal SAOUI',
    imageSrc: '/organizing-team/manal_saoui.jpeg',
    linkedinSrc: 'https://www.linkedin.com/in/manal-saoui/',
    category: 'organizingCommittee',
    order: 5
  },
  {
    name: 'Mohammed Reda EL MESSAOUDI',
    imageSrc: '/organizing-team/mohamed_reda_el_messaoudi.jpg',
    linkedinSrc: 'http://linkedin.com/in/mohamed-reda-el-messaoudi-bb21b2332',
    category: 'organizingCommittee',
    order: 6
  },
  {
    name: 'Amine HBAR',
    imageSrc: '/organizing-team/amine_hbar.jpeg',
    linkedinSrc: 'https://www.linkedin.com/in/amine-hbar-0748a2246/?originalSubdomain=fr',
    category: 'organizingCommittee',
    order: 7
  },
  {
    name: 'Fatima Zahra MOUDAKIR',
    imageSrc: '/organizing-team/fatima_zahra_moudakir.jpeg',
    linkedinSrc: 'https://linkedin.com/in/fatima-zahra-moudakir-615527246',
    category: 'organizingCommittee',
    order: 8
  },
  {
    name: 'Achraf EL KHAMSI',
    imageSrc: '/organizing-team/achraf_el_khamsi.jpeg',
    linkedinSrc: 'https://linkedin.com/in/achrafelkhamsi',
    category: 'organizingCommittee',
    order: 9
  },
  {
    name: 'Adam LACHKAR',
    imageSrc: '/organizing-team/adam_lachkar.jpg',
    linkedinSrc: 'https://www.linkedin.com/in/adam-lachkar-630010305/',
    category: 'organizingCommittee',
    order: 10
  },
  {
    name: 'Ayman AMASROUR',
    imageSrc: '/organizing-team/ayman_amasrour.jpeg',
    linkedinSrc: 'https://www.linkedin.com/in/ayman-amasrour-1a280228a/',
    category: 'organizingCommittee',
    order: 11
  },
  {
    name: 'Ayoub EN-NADIF',
    imageSrc: '/organizing-team/ayoub_ennadif.jpeg',
    linkedinSrc: 'https://www.linkedin.com/in/ayoub-en-nadif-439a63225/',
    category: 'organizingCommittee',
    order: 12
  },
  {
    name: 'Souhail ELBAKKARE',
    imageSrc: '/organizing-team/souhail_elbakkare.jpeg',
    linkedinSrc: 'https://www.linkedin.com/in/souhail-elbakkar-9aab2a284/',
    category: 'organizingCommittee',
    order: 13
  },
  {
    name: 'Kawtar TAÏK',
    imageSrc: '/organizing-team/kawtar_taik.jpeg',
    linkedinSrc: 'https://www.linkedin.com/in/kawtar-ta%C3%AFk-7544a11b9/',
    category: 'organizingCommittee',
    order: 14
  },
  
  // Staff
  {
    name: 'Issam TAUIL',
    imageSrc: '/organizing-team/issam_tauil.jpeg',
    linkedinSrc: 'https://linkedin.com/in/issam-tauil-8b70a9205',
    category: 'staff',
    order: 1
  },
  
  // Web Development
  {
    name: 'Achraf EL KHAMSI',
    imageSrc: '/organizing-team/achraf_el_khamsi.jpeg',
    linkedinSrc: 'https://linkedin.com/in/achrafelkhamsi',
    category: 'webDevelopment',
    order: 1
  },
  
  // Brand Design
  {
    name: 'Ayoub BENNOUNA',
    imageSrc: '/organizing-team/ayoub_bennouna.jpg',
    linkedinSrc: '',
    portfolioSrc: 'https://www.ayoubdesigns.com/',
    category: 'brandDesign',
    order: 1
  }
];

@Injectable()
export class TeamMembersSeederService {
  constructor(
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  async seed() {
    const count = await this.teamMemberRepository.count();
    
    // Skip seeding if there are already records in the database
    if (count > 0) {
      console.log('Team members table already seeded.');
      return;
    }
    
    // Create team members
    const teamMembers = this.teamMemberRepository.create(
      initialTeamData.map(member => ({
        ...member,
        isActive: true,
      }))
    );
    
    await this.teamMemberRepository.save(teamMembers);
    
    console.log(`Seeded ${teamMembers.length} team members.`);
  }
}