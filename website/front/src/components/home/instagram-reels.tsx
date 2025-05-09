"use client"


import React from 'react'
import { InstagramEmbed } from 'react-social-media-embed';

const InstagramReels = () => {
  return (
    <div 
      className="mt-6 animate-fade-up text-center opacity-0 space-y-4 md:space-y-0 md:flex md:space-x-[8rem]"
      style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
    >
      <InstagramEmbed url="https://www.instagram.com/reel/DJPbRHZs0R-/?igsh=MzFjazBtNXdiYnh6" width={328}/>
      <InstagramEmbed url="https://www.instagram.com/reel/DJUkNPJsl2f/?igsh=MTRxcnIwMHpscnAxdw==" width={328}/>
    </div>
  );
}

export default InstagramReels;
