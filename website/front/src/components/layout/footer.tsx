"use client"

import Image from 'next/image'
import React from 'react'
import SocialMediaLinks from '../home/social-media-links'
import useMediaQuery from '@/lib/hooks/use-media-query'

const Footer = () => {
  const { isMobile } = useMediaQuery();

  return (
    <div className="animate-fade-up w-full mt-10 px-5 py-10 xl:px-0 flex space-x-16 items-center justify-around">
      <div className='z-10 flex flex-col space-y-2 xl:space-y-0 xl:flex-row items-center space-x-8'>
        <img
          src="/mm.png"
          alt="M&M logo"
          style={{height: isMobile ? 'auto' : '40px', width: 'auto'}}
        />
        <img
          src="/CDG_logo.png"
          alt="CDG"
          style={{height: isMobile ? 'auto' : '60px', width: 'auto'}}
        />
        <img
          src="/LM6E.png"
          alt="LM6E"
          style={{height: isMobile ? 'auto' : '70px', width: 'auto'}}
        />
      </div>
      <div className='z-10'>
        <SocialMediaLinks />
      </div>
    </div>
  )
}

export default Footer
