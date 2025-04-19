"use client"

import { Separator } from "@/components/shared"
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { Button } from "@/components/shared";
import ProfileSkeleton from "../profile-skeleton";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useAuthGuard } from "@/components/hooks/use-auth-guard";
import { useRouter } from "next/navigation";
import { InviteButton } from "./components/invite-button";
import QuitButton from "./components/quit-button";
import { Badge } from "@/components/shared/badge";
import { ActionButton } from "./components/action-button";

export default function TeamPage() {
  useAuthGuard();
  const userData = useRecoilValue<any>(userState);
  const [content, setContent] = useState<any>(undefined);
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    const team = userData?.team;
    const isTeamLeader = team?.leader?.id === userData?.id 
    setIsTeamLeader(isTeamLeader);

    if (!team) {
      setContent({
        title: "Vous ne faites pas partie d'une équipe!",
        subtitle: "Merci pour l'intérêt que vous portez à MTYM! Malheureusement les inscriptions sont désormais closes. Néanmoins, restez à l'écoute pour ne pas manquer de futures opportunités.",
      })
    } else {
      setContent({
        title: isTeamLeader ? "Vous avez créé une équipe!" : "Vous avez rejoint une équipe!",
        subtitle: "Votre candidature sera jointe à celles de vos coéquipiers.",
      })
    }

    // Optional: Redirect after a delay
    const timeout = setTimeout(() => {
      router.push(`/${userData?.locale || 'fr'}/profile/application`);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [router, userData])

  const applicationCard = (
    <Card>
      <CardHeader>
        <CardTitle>
          Changement important
        </CardTitle>
        <CardDescription>
          Les candidatures en équipe ne sont plus requises. Chaque participant peut désormais postuler individuellement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Cette modification a été effectuée pour simplifier le processus de candidature. Toutes les candidatures existantes seront traitées individuellement.
        </p>
        <p>
          Vous allez être redirigé vers votre candidature individuelle dans quelques secondes...
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push(`/${userData?.locale || 'fr'}/profile/application`)}
        >
          Aller à ma candidature
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-medium">Équipe</div>
        <p className="text-sm text-muted-foreground">
          Changement de politique pour les candidatures.
        </p>
      </div>

      <Separator />

      {!userData
        ? <ProfileSkeleton />
        : applicationCard
      }
    </div>
  )
}
