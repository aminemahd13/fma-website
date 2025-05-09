"use client";

import React from "react";
import { Button } from "@/components/shared";
import { MeteorCard } from "./meteor-card";
import { useRouter } from "next/navigation";

const Informations = () => {
  const router = useRouter();

  return (
    <>
      <div className="drop-shadow-sm md:flex">
        <div className="w-full md:text-xl py-4 space-y-4">
          <p className="md:w-3/4">
          FMA est un camp d&apos;été de physique destiné aux lycéens
           du tronc commun et 1ère année bac. Pendant six jours, les participants découvrent
            différents domaines de la physique à travers des cours animés par des étudiants
             issus des plus grandes écoles internationales. Le programme inclut aussi des
              discussions en petits groupes, des ateliers pratiques et des conférences données
               par des chercheurs marocains de renom.{" "}

          </p>
          <p className="md:w-3/4">
          Au-delà des cours, FMA offre une immersion stimulante mêlant échanges,
           exploration scientifique et accompagnement personnalisé pour mieux 
           s&apos;orienter dans les études supérieures.{" "}


          </p>
          <Button disabled variant="default">
            Le programme complet sera publié prochainement
          </Button>
        </div>

        <div className="w-full md:leading-[5rem] font-medium text-4xl md:text-5xl">
          <p>
            <span className="bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text">
              40 - 50
            </span>{" "}
            Participants
          </p>
          <p>
            <span className="bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text">
             2
            </span>{" "}
            Workshops scientifiques
          </p>
          <p>
            <span className="bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text">
              6
            </span>{" "}
            jours entièrement pris en charge
          </p>
        </div>
      </div>

      <div className="drop-shadow-sm space-y-6 md:space-y-0 md:flex md:justify-around">
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

        <div className="w-full">
          <MeteorCard
            title="Autres événements"
            description="Découvrir comment se sont déroulés les derniers événements de Math&Maroc."
            ctaLabel="Découvrir d&apos;autres événements"
            className="h-full"
            onClick={() => window.open("http://mathmaroc.org/")}
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

        <div className="w-full">
          <MeteorCard
            title="Test de sélection"
            description="Apprenez plus sur le processus de sélection"
            ctaLabel="Voir la sélection"
            className="h-full"  
            onClick={() => router.push("/selection")}
          />
        </div>
      </div>
    </>
  );
};

export default Informations;
