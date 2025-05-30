"use client";

import { Separator } from "@/components/shared"
import { SidebarNav } from "./sidebar-nav"
import { useRecoilValue } from "recoil"
import { userState } from "@/store/userState"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const userData = useRecoilValue<any>(userState);
  
  // Check if user has an accepted application
  const isAccepted = userData?.application?.status?.status === 'ACCEPTED';
  
  // Base sidebar items
  const baseItems = [
    {
      title: "Compte",
      href: "/profile/account",
    },
    {
      title: "Candidature",
      href: "/profile/application",
    },
    {
      title: "Envoyer mon devoir maison",
      href: "/profile/rapport",
    }
  ];
  
  const sidebarNavItems = isAccepted 
    ? [...baseItems, { title: "Inscription finale", href: "/profile/inscription-finale" }]
    : baseItems;

  return (
    <div className="z-10 w-full px-5 max-w-screen-xl xl:px-0">
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Profil</h2>
          <div className="text-muted-foreground">
            Gérez vos candidatures et les informations de votre compte.
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-3xl">{children}</div>
        </div>
      </div>
    </div>
  )
}
