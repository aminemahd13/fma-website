"use client";
import React from "react";
import { SparklesCore } from "@/components/shared/sparkles";
import Image from "next/image";

export default function HeroSection({
  heroTitle,
  heroSubtitle,
  heroTitleResults,
}:{
  heroTitle: string,
  heroSubtitle: string,
  heroTitleResults: string,
}) {
  return (
    <div className="w-full bg-transparent flex flex-col items-center justify-center rounded-md">
      {/* Logo */}
      <div className="z-10 mt-8 mb-2">
        <Image
          src="/mtym.png"
          alt="M&M logo"
          width='400'
          height='200'
        />
      </div>

      {/* Sparkles */}
      <div className="w-[25rem] md:w-[80rem] h-[3rem] relative">
        <div className="absolute inset-x-40 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] md:w-3/4 blur-sm" />
        <div className="absolute inset-x-40 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px md:w-3/4" />
        <div className="absolute inset-x-80 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] md:w-2/4 blur-sm" />
        <div className="absolute inset-x-80 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px md:w-2/4" />

        <div className="w-full absolute inset-0">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1.4}
            particleDensity={300}
            className="w-full h-[30rem]"
            particleColor="#00008B"
          />
        </div>
      </div> 

      {/* Content */}
      <div className="z-10 space-y-8">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-6xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          {heroTitle}
        </h1>
        <p
          className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 [text-wrap:balance] md:text-lg"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {heroSubtitle}
        </p>
      </div>
    </div>
  );
}
