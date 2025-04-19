"use client"

import { languages } from '@/app/i18n/settings'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shared/dropdown-menu"
import { Button } from '@/components/shared'
import { EnglishFlag, FrenchFlag } from '@/components/shared/flags'
import { ReactNode } from 'react'

const LanguageSwitcher = ({ lang }: { lang: string}) => {
  const getFlagComponent = (lang: string): ReactNode => {
    switch(lang) {
      case 'fr':
        return <FrenchFlag className='h-4' />

      case 'en':
      default:
        return <EnglishFlag className='h-4' />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='p-0 h-fit'>
        <Button variant="outline">{getFlagComponent(lang)}</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='p-0 w-fit flex justify-center'>
        {languages
          .filter((language) => language !== lang)
          .map((language) => {
            return (
              <DropdownMenuItem key={language} className='p-0 w-fit'>
                <Link 
                  href={`/${language}`} 
                  onClick={() => {
                    if(document) document.cookie=`LANG=${language}; path=/`
                  }}
                >
                  <Button variant="outline">{getFlagComponent(language)}</Button>
                </Link>
              </DropdownMenuItem>
            )
          })
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher
