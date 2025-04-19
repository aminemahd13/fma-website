
import React, { MouseEventHandler, ReactNode } from "react";
import { Meteors } from "@/components/shared/meteors";
import { Button } from "../shared";

export function MeteorCard({
  children,
  title,
  description,
  ctaLabel,
  className,
  buttonDisabled=false,
  onClick,
} : {
  children?: ReactNode,
  title?: string,
  description?: string,
  ctaLabel?: string,
  className?: string,
  buttonDisabled?: boolean,
  onClick?: MouseEventHandler<HTMLButtonElement>,
}) {
  return (
    <div className={`w-full relative px-2 h-full`}>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-200 to-teal-200 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
      <div className={`relative px-8 shadow-xl bg-gray-900 border border-gray-800 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start ${className}`}>
        {children
          ? children
          : (
            <>
              <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-2 w-2 text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                  />
                </svg>
              </div>

              <h1 className="font-bold text-4xl text-white mb-4 relative z-50">
                {title}
              </h1>

              <p className="font-normal text-base text-slate-400 mb-4 relative z-50">
                {description}
              </p>
              
              <Button
                className="border px-4 py-1 rounded-lg border-white text-gray-300"
                disabled={buttonDisabled}
                onClick={onClick}
              >
                {ctaLabel}
              </Button>
            </>
          )
        }
        

        {/* Meaty part - Meteor effect */}
        <Meteors number={10} />
      </div>
    </div>
  );
}
