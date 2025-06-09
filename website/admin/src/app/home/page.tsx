"use client"

import { HoverEffect } from "@/components/shared/card-hover-effect";
import Image from "next/image";

const links = [
  {
    title: "Competition Results",
    description:
      "Manage competition results",
    link: "/home/competition-results",
  },
];

export default function Home() {

  return (
    <div className="">
      <div className='from-black to-stone-500 bg-clip-text text-4xl font-medium'>
        Dashboard
      </div>
      <div className="flex flex-col items-center pr-[15rem]">
        <div className="mt-20">
          <Image
            src="/fma.png"
            alt="FMA logo"
            width='400'
            height='200'
          />
        </div>

        <div className="max-w-5xl mx-auto px-8 ">
          <HoverEffect items={links} className="flex justify-center"/>
        </div>
      </div>
    </div>
  )
}
