'use client';

import React from 'react';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/navigation';
import { userState } from '@/store/userState';
import { useAuthModal } from '../layout/auth-modal';
import CtaButton from "../cta_button"; 

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

  <div className="text-center text-lg space-y-4 drop-shadow-sm mb-12 max-w-2xl mx-auto">
  <p>
  Il vous suffit de compléter le formulaire de pré-enregistrement et de passer la{" "}
  <a href="/selection" className="underline text-muted-foreground hover:text-foreground transition-colors">
    sélection
  </a>{" "}
  en déposant votre devoir maison depuis votre{" "}
  <a href="/profile/account" className="underline text-muted-foreground hover:text-foreground transition-colors">
    profil
  </a>.
</p>

  <p className="text-red-600 font-semibold">
    Attention : Votre tentative au devoir maison correspondant à votre niveau ainsi que vos documents administratifs doivent être envoyés avant le 8 juin à 23h59.
  </p>
</div>


  <div
    className="flex justify-center p-8 rounded-lg animate-fade-up opacity-0"
    style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
  >
<CtaButton
  onClick={handleApplyClick}
  label="Envoyer ma candidature"
  className="text-lg"
/>


  </div>
</div>
  );
}

export default TutorialSection;
