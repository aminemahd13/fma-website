"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useAuthModal } from "@/components/layout/auth-modal";

export default function SelectionPage() {
  const router = useRouter();
  const userData = useRecoilValue(userState);
  const { AuthModal, setShowAuthModal } = useAuthModal();

  const handleApplicationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userData) {
      setShowAuthModal(true);
    } else {
      router.push("/profile/application");
    }
  };

  return (
    <div className="w-full max-w-sm md:max-w-5xl px-5 xl:px-0 mt-10">
      <AuthModal />

      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Test de sélection
        </h1>

        <div
          className="mt-6 animate-fade-up text-center text-gray-800 opacity-0 md:text-lg"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          <p className="mt-12">
            La sélection pour participer au{" "}
            <span className="bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text">
               FMA Summer Camp
            </span>{" "}
            se déroule en deux phases. Le test commence le {" "}
            <span className="font-bold">5 mai</span>.
          </p>

          <div className="mt-8 text-left md:text-center">
            <p className="text-red-600 font-bold text-lg mb-2">
              Phase 1 – Date limite de soumission : 08 juin 2025 à 23h59.
            </p>

            <p className="font-bold mb-2">📝 Phase 1 – Rapport écrit :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Faites le sujet correspondant à votre niveau actuel (de l'année scolaire 2024/2025).</li>
              <li>Téléchargez le document du thème, et répondez aux questions dans un rapport structuré.</li>
              <li>
                Connectez-vous à la plateforme pour soumettre votre candidature via votre espace personnel {" "}
                <span className="text-red-600 font-semibold">avant le 08 juin 2025 à 23h59.</span>.
              </li>
            </ul>

            <p className="font-bold mt-6 mb-2">🎙️ Phase 2 – Entretien (si nécessaire) :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Les rapports seront examinés par notre jury scientifique.</li>
              <li>Certains candidats pourront être conviés à un entretien oral.</li>
              <li>Les résultats finaux seront annoncés après cette étape.</li>
            </ul>
          </div>

          <p className="mt-8">
            Retrouvez ci-dessous les deux thèmes de cette édition, puis connectez-vous pour soumettre votre travail :
          </p>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-col items-center gap-8 p-8 animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          {/* Candidater Button */}
          <button
            className="relative h-40 w-40 rounded-full bg-gradient-to-br from-green-600 via-teal-500 to-blue-700 shadow-[0_0_40px_rgba(34,197,94,0.7)] hover:scale-105 transition-transform duration-500 animate-float flex items-center justify-center text-center backdrop-blur-sm ring-2 ring-white/20"
            onClick={handleApplicationClick}
          >
            <span className="text-white font-semibold text-base text-center z-10 pointer-events-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              🔐<br />
              Candidater<br />
              <span className="text-sm text-red-200 font-normal">Deadline : 08 juin 2025 à 23h59.</span>
            </span>
            <div className="absolute w-[170%] h-[170%] border border-green-300/20 rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute h-3.5 w-3.5 bg-white rounded-full right-0 top-2 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-moon" />
          </button>

          {/* Thematic PDFs */}
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {/* Refroidissement Laser */}
            <Link
              href="https://drive.google.com/file/d/13OfY6lj-gnpoeGwJXQNPraipxILEXZos/view?usp=sharing"
              target="_blank"
            >
              <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 shadow-[0_0_40px_rgba(59,130,246,0.7)] hover:scale-105 transition-transform duration-500 animate-float flex items-center justify-center text-center backdrop-blur-sm ring-2 ring-white/20">
                <span className="text-white font-semibold text-sm text-center leading-tight z-10 pointer-events-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                  🧊 1<sup>ère</sup> année Bac<br />
                  <span className="text-base font-bold">Refroidissement laser</span>
                </span>
                <div className="absolute w-[170%] h-[170%] border border-blue-300/20 rounded-full animate-spin-slow pointer-events-none" />
                <div className="absolute h-3.5 w-3.5 bg-white rounded-full right-0 top-2 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-moon" />
              </div>
            </Link>

            {/* Expansion de l'univers */}
            <Link
              href="https://drive.google.com/file/d/13OfY6lj-gnpoeGwJXQNPraipxILEXZos/view?usp=sharing"
              target="_blank"
            >
              <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-purple-700 via-violet-600 to-pink-600 shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:scale-105 transition-transform duration-500 animate-float flex items-center justify-center text-center backdrop-blur-sm ring-2 ring-white/20">
                <span className="text-white font-semibold text-sm text-center leading-tight z-10 pointer-events-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                  🌌 Tronc commun<br />
                  <span className="text-base font-bold">Expansion de l&apos;univers</span>
                </span>
                <div className="absolute w-[170%] h-[170%] border border-purple-300/20 rounded-full animate-spin-slow pointer-events-none" />
                <div className="absolute h-3.5 w-3.5 bg-white rounded-full right-0 top-2 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-moon" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
