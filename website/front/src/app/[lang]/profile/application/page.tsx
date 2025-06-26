"use client"

import { Separator } from "@/components/shared"
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/shared";
import ProfileSkeleton from "../profile-skeleton";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useAuthGuard } from "@/components/hooks/use-auth-guard";
import { useRouter } from "next/navigation";
import { getApplicationsOpenStatus } from "@/api/SettingsApi";

const getBadgeClassname = (status: string) => {
  switch(status) {
    case 'DRAFT':
      return 'bg-gray-300 text-black';
    case 'PENDING':
      return 'bg-[#FFE380] text-black';
    case 'NOTIFIED':
      return 'bg-[#79E2F2] text-black';
    case 'UPDATED':
      return 'bg-[#B3D4FF] text-black';
    case 'VALIDATED':
      return 'bg-[#79F2C0] text-black';
    case 'ACCEPTED':
      return 'bg-[#006644] text-white';
    case 'REJECTED':
      return 'bg-[#BF2600] text-white';
    case 'WAITLIST':
      return 'bg-[#403294] text-white';
  }
}

export default function ApplicationPage() {
  useAuthGuard();
  const userData = useRecoilValue<any>(userState);
  const [content, setContent] = useState<any>(undefined);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  
  // Check if applications are open
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const response = await getApplicationsOpenStatus() as any;
        if (response?.statusCode === 200) {
          setIsApplicationsOpen(response.isOpen);
        }
      } catch (error) {
        console.error("Failed to check application status", error);
        // Default to closed if there's an error
        setIsApplicationsOpen(false);
      }
    };
    
    checkApplicationStatus();
  }, []);
  
  useEffect(() => {
    // If userData is loaded, set isLoading to false
    if (userData !== undefined) {
      setIsLoading(false);
    }
    
    const application = userData?.application;
    const applicationStatus = application?.status?.status;

    if (!application) {
      if (isApplicationsOpen) {
        setContent({
          title: "Vous n'avez pas encore soumis de candidature",
          subtitle: "Nous sommes ravis de votre intérêt pour FMA! Vous pouvez dès maintenant soumettre votre candidature en cliquant sur le bouton ci-dessous.",
          ctaLabel: "Créer votre candidature",
        });
      } else {
        setContent({
          title: "Vous n'avez pas soumis une candidature",
          subtitle: "Merci pour l'intérêt que vous portez à FMA! Malheureusement les inscriptions sont désormais closes. Néanmoins, restez à l'écoute pour ne pas manquer de futures opportunités.",
          ctaLabel: "Créer votre candidature",
        });
      }
    } else if (applicationStatus === 'DRAFT') {
      if (isApplicationsOpen) {
        setContent({
          title: "Vous avez sauvegardé un brouillon de candidature",
          subtitle: "Vous pouvez continuer votre candidature en cliquant sur le bouton ci-dessous.",
          ctaLabel: "Continuer votre candidature",
        });
      } else {
        setContent({
          title: "Vous avez sauvegardé un brouillon de candidature. Elle n'est pas encore soumise.",
          subtitle: "Merci pour l'intérêt que vous portez à FMA! Malheureusement les inscriptions sont désormais closes. Néanmoins, restez à l'écoute pour ne pas manquer de futures opportunités.",
          ctaLabel: "Continuer votre candidature",
        });
      }
    } else {
      // Set content based on application status
      // For ACCEPTED status, don't show the update button
      const isAccepted = applicationStatus === 'ACCEPTED';
      
      setContent({
        title: "Vous avez déjà soumis une candidature",
        subtitle: isAccepted 
          ? "Félicitations! Votre candidature a été acceptée. Vous ne pouvez plus la modifier."
          : "Vous trouverez l'avancement de votre candidature ci-dessous. On vous notifiera des prochaines étapes par mail.",
        ctaLabel: "Mettre à jour votre candidature",
        showUpdateButton: !isAccepted // Only show update button if not accepted
      });
    }
  }, [userData, isApplicationsOpen]);

  const applicationCard = (
    <Card>
      <CardHeader>
        <CardTitle loading={isLoading}>
          {content?.title}
        </CardTitle>
        <CardDescription loading={isLoading}>
          {content?.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userData?.application && 
          <>
            <div className="text-sm"><span className="font-bold">Date de soumission</span>: {formatDate(userData?.application?.createdAt)}</div>
            <div className="text-sm"><span className="font-bold">Date de sauvegarde</span>: {formatDate(userData?.application?.updatedAt)}</div>
            <div className="text-sm"><span className="font-bold">Status</span>: <Badge className={`px-4 ${getBadgeClassname(userData?.application?.status?.status)}`}>{userData?.application?.status?.status}</Badge></div>
          </>
        }
      </CardContent>
      {((userData?.application && userData?.application?.status?.status !== 'DRAFT') || 
         !userData?.application || 
         (userData?.application?.status?.status === 'DRAFT' && isApplicationsOpen)) ? (
        <CardFooter>
          <Button
            onClick={() => router.push(`/${userData?.locale || 'fr'}/application`)}
          >
            {content?.ctaLabel}
          </Button>
        </CardFooter> 
      ) : null}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-medium">Candidature</div>
        <p className="text-sm text-muted-foreground">
          C&apos;est ici que vous trouverez le statut de votre candidature.
        </p>
      </div>

      <Separator />

      {!userData ? (
  <ProfileSkeleton />
) : (
  <>
<div className="border border-yellow-400 bg-yellow-100 text-yellow-800 p-4 rounded-lg">
  <p className="font-semibold">⚠️ N&apos;oubliez pas !</p>
  <p>
    Une fois votre candidature créée, vous devez également <strong>nous envoyer votre devoir maison <a href="/profile/rapport" className="underline">en cliquant ici</a> avant le 8 juin 2025</strong>. 
    La création de la candidature seule <strong>ne suffit pas</strong> pour être accepté.
  </p>
</div>

    {applicationCard}
  </>
)}

    </div>
  )
}
