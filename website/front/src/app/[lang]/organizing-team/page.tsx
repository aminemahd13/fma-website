'use client';

import { useEffect, useState } from 'react';
import { Linkedin } from '@/components/shared/icons';
import Link from 'next/link';
import { shuffle } from '@/lib/utils';
import Brush from '@/components/shared/icons/brush';
import { fetchTeamMembersByCategory, TeamMember } from '@/lib/api/team-members';
import { TeamMemberCategory } from '@/types/team-member';

const Card = ({
  key,
  name,
  imageSrc,
  linkedinSrc,
  portfolioSrc,
}:{
  key: string,
  name: string,
  imageSrc: string,
  linkedinSrc?: string,
  portfolioSrc?: string,
}) => {
  return (
    <div 
      className="h-[18rem] w-[18rem] bg-white border-b-4 border-red-500 flex flex-col justify-center items-center space-y-4 rounded-md"
      key={key}
    > 
      <div className="h-fit">
        <img
          src={imageSrc}
          style={{height: '180px', width: 'auto'}}
          alt={name}
        />
      </div>

      <div className='font-semibold flex space-x-2 bg-gradient-to-br from-black to-stone-600 inline-block text-transparent bg-clip-text'>
        <div className='text-base'>{name}</div> 
        {linkedinSrc && <div><Link href={linkedinSrc} target='_blank' className='shadow-md'><Linkedin className="h-5 w-5 text-[#f04b5b]" /></Link></div>}
        {portfolioSrc && <div><Link href={portfolioSrc} target='_blank' className='shadow-md'><Brush className="h-6 w-6 text-[#f04b5b]" /></Link></div>}
      </div>
    </div>
  )
}

export default function OrganizingTeamPage() {
  const [organizingCommittee, setOrganizingCommittee] = useState<TeamMember[]>([]);
  const [staff, setStaff] = useState<TeamMember[]>([]);
  const [webDevelopment, setWebDevelopment] = useState<TeamMember[]>([]);
  const [brandDesign, setBrandDesign] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        // Fetch team members for each category
        const committeeMembers = await fetchTeamMembersByCategory('organizingCommittee' as TeamMemberCategory);
        const staffMembers = await fetchTeamMembersByCategory('staff' as TeamMemberCategory);
        const webDevMembers = await fetchTeamMembersByCategory('webDevelopment' as TeamMemberCategory);
        const designMembers = await fetchTeamMembersByCategory('brandDesign' as TeamMemberCategory);
        
        // Sort team members by the order property
        const sortByOrder = (a: TeamMember, b: TeamMember) => 
          (a.order !== undefined && b.order !== undefined) ? a.order - b.order : 0;
        
        setOrganizingCommittee(committeeMembers.sort(sortByOrder));
        setStaff(staffMembers.sort(sortByOrder));
        setWebDevelopment(webDevMembers.sort(sortByOrder));
        setBrandDesign(designMembers.sort(sortByOrder));
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-sm md:max-w-[85rem] px-5 xl:px-0 mt-10 text-center">
        <p>Loading team members...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm md:max-w-[85rem] px-5 xl:px-0 mt-10">
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <span className='mb-8 bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>Organizing Team</span>
        </h1>

        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-4xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <span className='bg-gradient-to-br from-sky-800 to-[#272162] inline-block text-transparent bg-clip-text'>Math&Maroc</span> <span className='font-extralight'>{" | "}</span>
          <span className='bg-gradient-to-br from-black to-stone-500 inline-block text-transparent bg-clip-text'>Organizing Committee</span>
        </h1>

        <div 
          className="flex justify-around flex-wrap gap-6 shadow-md p-8 rounded-lg animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          {organizingCommittee.length > 0 ? (
            organizingCommittee.map(person => (
              <Card
                key={`${person.id}_${person.name.toLowerCase().replace(' ', '_')}`}
                name={person.name}
                imageSrc={person.imageSrc} 
                linkedinSrc={person.linkedinSrc}
              />
            ))
          ) : (
            <p className="text-center w-full">No organizing committee members found.</p>
          )}
        </div>

        <div className='flex flex-col justify-around space-y-6 flex-wrap gap-y-6 md:flex-row md:space-y-0'>
          <div className='w-full md:w-1/2 space-y-4'>
            <h1
              className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-4xl md:leading-[4rem]"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              <span className='bg-gradient-to-br from-sky-800 to-[#272162] inline-block text-transparent bg-clip-text'>Math&Maroc</span> <span className='font-extralight'>{" | "}</span>
              <span className='bg-gradient-to-br from-black to-stone-500 inline-block text-transparent bg-clip-text'>Staff</span>
            </h1>
            
            <div 
              className="flex justify-around flex-wrap gap-6 shadow-md p-8 rounded-lg animate-fade-up opacity-0 mr-6"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              {staff.length > 0 ? (
                staff.map(person => (
                  <Card
                    key={`${person.id}_${person.name.toLowerCase().replace(' ', '_')}`}
                    name={person.name}
                    imageSrc={person.imageSrc} 
                    linkedinSrc={person.linkedinSrc}
                  />
                ))
              ) : (
                <p className="text-center w-full">No staff members found.</p>
              )}
            </div>
          </div>

          <div className='w-full md:w-1/2 space-y-4'>
            <h1
              className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-4xl md:leading-[4rem]"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              <span className='bg-gradient-to-br from-sky-800 to-[#272162] inline-block text-transparent bg-clip-text'>Math&Maroc</span> <span className='font-extralight'>{" | "}</span>
              <span className='bg-gradient-to-br from-black to-stone-500 inline-block text-transparent bg-clip-text'>Website Development</span>
            </h1>

            <div 
              className="flex justify-around flex-wrap gap-6 shadow-md  p-8 rounded-lg animate-fade-up opacity-0 ml-6"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              {webDevelopment.length > 0 ? (
                webDevelopment.map(person => (
                  <Card
                    key={`${person.id}_${person.name.toLowerCase().replace(' ', '_')}`}
                    name={person.name}
                    imageSrc={person.imageSrc} 
                    linkedinSrc={person.linkedinSrc}
                  />
                ))
              ) : (
                <p className="text-center w-full">No web development members found.</p>
              )}
            </div>
          </div>

          <div className='w-full md:w-1/2 space-y-4'>
            <h1
              className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-4xl md:leading-[4rem]"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              <span className='bg-gradient-to-br from-sky-800 to-[#272162] inline-block text-transparent bg-clip-text'>Math&Maroc</span> <span className='font-extralight'>{" | "}</span>
              <span className='bg-gradient-to-br from-black to-stone-500 inline-block text-transparent bg-clip-text'>Branding & Design</span> 
            </h1>

            <div 
              className="flex justify-around flex-wrap gap-6 shadow-md p-8 rounded-lg animate-fade-up opacity-0 mx-6"
              style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
            >
              {brandDesign.length > 0 ? (
                brandDesign.map(person => (
                  <Card
                    key={`${person.id}_${person.name.toLowerCase().replace(' ', '_')}`}
                    name={person.name}
                    imageSrc={person.imageSrc} 
                    linkedinSrc={person.linkedinSrc}
                    portfolioSrc={person.portfolioSrc}
                  />
                ))
              ) : (
                <p className="text-center w-full">No branding & design members found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}