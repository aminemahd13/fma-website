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
import { downloadConvocation } from "@/api/ConvocationApi";
import { toast } from "@/components/hooks/use-toast";

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

  const handleDownloadConvocation = async () => {
    try {
      const response = await downloadConvocation();

      if (response?.status === 200) {
        // Create a link element, set its href to the blob URL, and click it programmatically
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `convocation_${userData?.firstName}_${userData?.lastName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: "Téléchargement réussi",
          description: "Votre convocation a été téléchargée avec succès.",
        });
      } else {
        toast({
          title: "Erreur de téléchargement",
          description: "Erreur lors du téléchargement de la convocation.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to download convocation", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur s'est produite lors du téléchargement de la convocation.",
        variant: "destructive",
      });
    }
  };

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
        <CardFooter className="flex gap-2 flex-wrap">
          {/* Show update button for non-accepted candidates or when applications are open */}
          {(content?.showUpdateButton !== false) && (
            <Button
              onClick={() => router.push(`/${userData?.locale || 'fr'}/application`)}
            >
              {content?.ctaLabel}
            </Button>
          )}
          
          {/* Show download convocation button for accepted candidates */}
          {userData?.application?.status?.status === 'ACCEPTED' && (
            <Button
              onClick={handleDownloadConvocation}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-green-500 hover:border-green-600"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Télécharger la convocation
            </Button>
          )}
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
    
    {/* Success message for accepted candidates */}
    {userData?.application?.status?.status === 'ACCEPTED' && (
      <div className="border border-green-400 bg-green-50 text-green-800 p-4 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="font-semibold">🎉 Félicitations ! Votre candidature a été acceptée !</p>
        </div>
        <p className="mt-2">
          Vous pouvez maintenant télécharger votre convocation personnalisée en cliquant sur le bouton ci-dessus. 
          Cette convocation contient votre nom et votre numéro de candidature, et sera nécessaire pour votre participation à la formation.
        </p>
      </div>
    )}
  </>
)}

    </div>
  )
}
