"use client"

import { Compass, Exam, Rocket, Solution, Trophy } from "@/components/shared/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProblemsPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm md:max-w-5xl px-5 xl:px-0 mt-10">
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Dernière édition
        </h1>

        <div
          className="mt-6 animate-fade-up text-center text-gray-800 opacity-0 [text-wrap:balance] md:text-lg"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          <p className="mt-12">
            Découvrez comment s&apos;est déroulée la dernière édition de <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>MFA</span> au Lycée Mohamed 6 d&apos;Excellence de Benguerir, avec des participants venus de tous les coins du Maroc pour démontrer leurs compétences dans le cadre d&apos;une compétition de recherche de haut niveau valorisant la bienveillance entre les compétiteurs.  
          </p>

          <p className="mt-12">
            Les problèmes proposés à <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>MFA</span> sont très stimulants et nécessitent une bonne maîtrise des bases mathématiques et physiques, puisqu&apos;ils sont conçus pour aider à développer l&apos;esprit de recherche chez les lycéens.  
          </p>

          <p className="mt-6">
            Besoin de plus d&apos;idées sur le type de problèmes à <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>MFA</span> ? Ici tu trouveras tout pour assouvir ta curiosité !
          </p>
        </div>
        
        <div
          className="flex justify-around flex-wrap gap-6 p-8 animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <div className="space-y-4 flex flex-col md:flex-row md:space-x-4 md:space-y-0">          
            <Link href='https://drive.google.com/file/d/1NlL0g7inbF_zO_jVfyzs--IpHzG_VLor/view?usp=drive_link' target="_blank">
              <div 
                className="h-[8rem] w-[9rem] py-2 bg-white border-b-4 border-b-red-500 border-2 shadow-md flex justify-center items-center rounded-md hover:cursor-pointer"
              > 
                <div className="flex flex-col items-center text-center p-4">
                  <span className="text-sm">Problèmes 2023/2024</span>
                  <Exam />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}