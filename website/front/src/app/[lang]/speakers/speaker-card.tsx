"use client"

import { Diploma } from '@/components/shared/icons'
import React from 'react'
import Button from '@/components/shared/button';
import Link from 'next/link';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/shared/drawer";
import { SpeakerDetails, TalkAbstract } from './speakers';
import { Separator } from '@/components/shared';


const SpeakerCard = ({
  firstName,
  lastName,
  position,
  imageUrl,
  portfolioUrl,
}:{
  firstName: string,
  lastName: string,
  position: string,
  imageUrl: string,
  portfolioUrl: string,
}) => {
  return (
    <div className="w-fit flex flex-col items-center p-4 md:items-start md:w-[48%] md:flex-row md:space-x-4 border-b-2">
      <div className="h-3/4 w-3/4 mb-4 md:mb-0 md:h-1/3 md:w-1/3">
        <img
          src={imageUrl}
        />
      </div>

      <div className='flex flex-col justify-between h-full w-3/4 md:h-full md:w-2/3'>
        <div className='flex flex-col mb-4 md:mb-0'>
          <div className='text-2xl font-semibold'>{firstName} {lastName}</div>
          <div className='text-lg font-light'>{position}</div>
          <div className='mt-2 p-[3px] w-fit border border-gray-500 rounded hover:bg-gray-200 transition duration-300'><Link href={portfolioUrl} target='_blank' className='shadow-md'><Diploma className="h-5 w-5 text-[#f04b5b]" /></Link></div>
        </div>

        <div className='flex flex-col space-y-2 md:flex-row md:space-x-4 items-center'>
          <Drawer>
            {firstName.toLowerCase() !== 'rachid' && 
              <DrawerTrigger asChild>
                <Button className='bg-gray-200 text-black hover:text-white'>Talk Abstract</Button>
              </DrawerTrigger>
            }

            <DrawerContent>
              <div className="px-6 h-full flex flex-col justify-between">
                <>
                  <DrawerHeader>
                    <DrawerTitle className='text-lg md:text-2xl md:mb-4'>Talk Abstract</DrawerTitle>
                    <Separator className='md:mb-10'/>
                    <DrawerTitle className='text-lg md:text-2xl -mb-2'>{firstName} {lastName}</DrawerTitle>
                    <DrawerDescription>{position}</DrawerDescription>
                  </DrawerHeader>

                  <div className="p-4 pb-0 space-y-4 text-gray-800 text-xs md:text-base">
                    <TalkAbstract name={firstName.toLowerCase()} />
                  </div>
                </>
                
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          <Drawer>
            <DrawerTrigger asChild>
              <div className='text-base font-light underline underline-offset-4 hover:cursor-pointer hover:text-[#262061]'> Learn more </div>
            </DrawerTrigger>

            <DrawerContent>
              <div className="px-6 h-full flex flex-col justify-between">
                <>
                  <DrawerHeader>
                    <DrawerTitle className='text-2xl -mb-2'>{firstName} {lastName}</DrawerTitle>
                    <DrawerDescription>{position}</DrawerDescription>
                    <div className="h-3/4 w-3/4 md:h-1/2 md:w-1/2">
                      <img
                        src={imageUrl}
                      />
                    </div>
                  </DrawerHeader>

                  <div className="p-4 pb-0 space-y-4 text-gray-800 text-xs md:text-base">
                    <SpeakerDetails name={firstName.toLowerCase()} />
                  </div>
                </>
                
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button>Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  )
}

export default SpeakerCard
