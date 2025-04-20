"use client"

import { Compass, Exam, Rocket, Solution, Trophy } from "@/components/shared/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SelectionPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm md:max-w-5xl px-5 xl:px-0 mt-10">
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Test de sélection
        </h1>

        <div
          className="mt-6 animate-fade-up text-center text-gray-800 opacity-0 [text-wrap:balance] md:text-lg"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          <p className="mt-12">
            La sélection pour la participation à <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>MFA</span> se fait principalement sur la base d&apos;un test de sélection en ligne qui aura lieu le <span className="font-bold">06 octobre 2024</span>. <span className="font-bold">Bloquer bien ce jour dans votre calendrier.</span>
          </p>

          <p className="mt-6">
            Le <span className="font-bold">syllabus</span> vous permettra de connaître les sujets couverts lors du test. 
          </p>

          <p className="mt-6">
            Les <span className="font-bold">questions types</span> du test de sélection vous donneront une idée sur les questions auxquelles il faut s&apos;attendre et sont mises à votre disposition pour vous aider à vous y préparer.
          </p>
        </div>
        
        <div
          className="flex justify-around flex-wrap gap-6 p-8 animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <div className="space-y-4 flex flex-col md:flex-row md:space-x-8 md:space-y-0">          
            <Link href='https://drive.google.com/file/d/1jw5CnHPFfalatYdoPDCz9cKt7yYp6bdL/view?usp=drive_link' target="_blank">
              <div 
                className="h-[8rem] w-[9rem] bg-white border-b-4 border-b-red-500 border-2 shadow-md flex justify-center items-center rounded-md py-2 hover:cursor-pointer"
              > 
                <div className="flex flex-col items-center text-center">
                <span className="text-sm">Syllabus 2024/2025</span>
                <Compass />
                </div>
              </div>
            </Link>

            <Link href='https://drive.google.com/file/d/1LoMTILi7YbOp11FdCioLDpyR5smT7m7i/view?usp=sharing' target="_blank">
              <div 
                className="h-[8rem] w-[9rem] bg-white border-b-4 border-b-red-500 border-2 shadow-md flex justify-center items-center rounded-md py-2 hover:cursor-pointer"
              > 
                <div className="flex flex-col items-center text-center">
                  <span className="text-sm">Questions types</span>
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