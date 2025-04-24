"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import {
  DottedLine1,
  DottedLine2,
  DottedLine3,
} from "../shared/icons/dotted-lines";
import { Button } from "../shared";
import { MeteorCard } from "./meteor-card";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { useAuthModal } from "../layout/auth-modal";

const CtaButton = () => {
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const userData = useRecoilValue(userState);
  const { AuthModal, setShowAuthModal } = useAuthModal();

  return (
    <div
      className="text-center animate-fade-up opacity-0 space-y-4 space-x-8"
      style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
    >
      <AuthModal />

      <MeteorCard className="w-full flex flex-col space-y-4 items-center bg-transparent border-gray-400 py-4">
        <Link href="results" target="_self">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <button className="p-[3px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-[#2C2C62] rounded-lg" />
              <div className="px-8 py-2 bg-white rounded-[6px] relative group transition duration-200 text-black hover:bg-transparent hover:text-white">
                Voir les résultats
              </div>
            </button>
          </div>
        </Link>

        <div className="w-full flex flex-col space-y-4 md:flex-row md:justify-center md:space-y-0 md:space-x-6">
          <Link href="organizing-team" target="_blank">
            <Button className="border border-white text-white w-[11rem] bg-[#2C2C62]">
              Équipe organisatrice
            </Button>
          </Link>
          <Link href="partners">
            <Button className="border border-white text-white w-[11rem] bg-[#2C2C62]">
              Partenaires
            </Button>
          </Link>
        </div>
      </MeteorCard>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        {!isMobile && <DottedLine1 className="w-1/6" />}

        <button
          className="p-[3px] relative"
          onClick={(e) => {
            e.preventDefault();
            if (!userData) {
              setShowAuthModal(true);
            } else {
              router.push("/profile/application");
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-[#272162] rounded-lg" />
          <div className="px-8 py-2 bg-white rounded-[6px] relative group transition duration-200 text-black hover:bg-transparent hover:text-white">
            Envoyer une candidature
          </div>
        </button>

        {!isMobile && <DottedLine2 className="w-1/6" />}

        <button
          className="p-[3px] relative"
          onClick={() => router.push("/selection")}
        >
          <div className="absolute inset-0 bg-[#272162] rounded-lg" />
          <div className="px-8 py-2 bg-white rounded-[6px] relative group transition duration-200 text-gray-900 hover:bg-transparent hover:text-white">
            Consulter le test et les critères de sélection
          </div>
        </button>

        {!isMobile && <DottedLine3 className="w-1/6" />}
      </div>

      <p>
        Merci pour l&apos;intérêt que vous portez à{" "}
        <span className="font-semibold text-[#272162]">FMA</span>!
      </p>
    </div>
  );
};

export default CtaButton;
