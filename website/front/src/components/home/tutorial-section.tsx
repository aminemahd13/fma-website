'use client';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/navigation';
import { userState } from '@/store/userState';
import { useAuthModal } from '../layout/auth-modal';

const TutorialSection = () => {
  const userData = useRecoilValue(userState);
  const router = useRouter();
  const { AuthModal, setShowAuthModal } = useAuthModal();

  const handleApplyClick = () => {
    if (!userData) {
      setShowAuthModal(true);
    } else {
      router.push('/application');
    }
  };

  return (
    <div className="">
      <AuthModal />

      <div className="drop-shadow-sm space-y-6 md:space-y-0 md:flex md:justify-around mb-12 text-center text-lg">
        Êtes-vous intéressé à nous rejoindre dans cette aventure ?<br />
        Il suffit de consulter le test de sélection et de nous envoyer votre candidature directement depuis votre profil !
      </div>

      <div
        className="flex justify-center p-8 rounded-lg animate-fade-up opacity-0"
        style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
      >
        <button className="p-[3px] relative" onClick={handleApplyClick}>
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-[#272162] rounded-lg" />
          <div className="px-16 py-8 bg-blue rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent hover:text-white">
            Envoyer ma candidature
          </div>
        </button>
      </div>
    </div>
  );
};

export default TutorialSection;
