import React from 'react'
import { Facebook, Instagram, Linkedin, Youtube } from '@/components/shared/icons'

const SocialMediaLinks = () => {
  return (
    <div className='z-10 flex flex-col xl:flex-row justify-center w-full xl:space-x-4'>
      <a
        href="https://www.instagram.com/mathmaroc/"
        target="_blank"
        rel="noreferrer"
        className="mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-red-100 px-7 py-2 transition-colors hover:bg-red-200 opacity-0"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        <Instagram className="h-5 w-5 text-[#f04b5b]" />
        <p className="hidden md:block text-sm font-semibold text-[#f04b5b]">
          Math&Maroc
        </p>
      </a>
      
      <a
        href="https://www.facebook.com/MathsMaroc2"
        target="_blank"
        rel="noreferrer"
        className="mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200 opacity-0"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        <Facebook className="h-5 w-5 text-[#0d7ec4]" />
        <p className="hidden md:block text-sm font-semibold text-[#0d7ec4]">
          Math&Maroc
        </p>
      </a>

      <a
        href="https://www.youtube.com/@mathmaroc1396"
        target="_blank"
        rel="noreferrer"
        className="mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-red-100 px-7 py-2 transition-colors hover:bg-red-200 opacity-0"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        <Youtube className="h-5 w-5 text-[#ff0000]" />
        <p className="hidden md:block text-sm font-semibold text-[#ff0000]">
          Math&Maroc
        </p>
      </a>

      <a
        href="https://www.linkedin.com/company/mathemaroc/?trk=public_profile_experience-item_profile-section-card_image-click&originalSubdomain=fr"
        target="_blank"
        rel="noreferrer"
        className="mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200 opacity-0"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        <Linkedin className="h-5 w-5 text-[#0d7ec4]" />
        <p className="hidden md:block text-sm font-semibold text-[#0d7ec4]">
          Math&Maroc
        </p>
      </a>
    </div>
  )
}

export default SocialMediaLinks
