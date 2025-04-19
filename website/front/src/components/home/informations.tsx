"use client"

import React from 'react'
import { Button } from '@/components/shared';
import { MeteorCard } from './meteor-card';
import { useRouter } from 'next/navigation';

const Informations = () => {
  const router = useRouter();

  return (
    <>
      <div
        className="drop-shadow-sm md:flex"
      >
        <div className="w-full md:text-xl py-4 space-y-4">
          <p className="md:w-3/4">MTYM est une compétition de recherche déstinée aux lycéens d&apos;orientation scientifique. Elle consiste à explorer des problèmes mathématiques pendant trois mois en équipe et présenter les solutions sous forme d&apos;un débat. </p>
          <p className="md:w-3/4">Préparez-vous à vivre une expérience riche en divertissement, workshops, conférences scientifiques et séances d&apos;orientation.</p>
          <Button disabled variant='default'>
        Le programme complet sera publié prochainement
        </Button>
        </div>

        
        

        <div className="w-full md:leading-[5rem] font-medium text-4xl md:text-5xl">
          <p><span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>200+</span> Participants</p>
          <p><span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>3</span> Workshops scientifiques</p>
          <p><span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>4</span> jours entièrement pris en charge</p>
        </div>
      </div>

      <div
        className="drop-shadow-sm space-y-6 md:space-y-0 md:flex md:justify-around"
      >
        {/* <div className='w-full'>
          <MeteorCard 
            title='Speakers' 
            description='Échangez avec des conférenciers d&apos;institutions de renommée mondiale.'
            ctaLabel='Publié prochainement...'
            className='h-full'
            buttonDisabled={true}
            onClick={() => router.push('/speakers')}
          />
        </div> */}

        <div className='w-full'>
          <MeteorCard 
            title='Dernière Édition' 
            description='Découvrez comment s&apos;est déroulé la dernière édition de MTYM.'
            ctaLabel='Voir la dernière édition'
            className='h-full'
            onClick={() => router.push('/last-edition')}
          />
        </div>

        {/* <div className='w-full'>
          <MeteorCard 
            title='Prix' 
            description='Découvrez les prix réservés aux meilleurs participants du concours.'
            ctaLabel='Publié prochainement...'
            className='h-full'
            buttonDisabled={true}
            onClick={() => router.push('/prizes')}
          />
        </div> */}

        <div className='w-full'>
          <MeteorCard 
            title='Test de sélection' 
            description='Apprenez plus sur le processus de sélection'
            ctaLabel='Voir la sélection'
            className='h-full'
            onClick={() => router.push('/selection')}
          />
        </div>
      </div>
    </>
  )
}

export default Informations
