"use client";

import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { Separator } from "@/components/shared";
import ProfileSkeleton from "../profile-skeleton";
import { formatDate, computeSHA256, getUploadFolderName, generateFileName } from "@/lib/utils";
import { getSignedURL, uploadFile } from "@/api/MediaApi";
import { toast } from "@/components/hooks/use-toast";

const getBadgeClassname = (status: string) => {
  switch (status) {
    case "VALID":
      return "bg-[#79F2C0] text-black";
    case "NOT_VALID":
      return "bg-[#BF2600] text-white";
    case "PENDING":
      return "bg-yellow-200 text-black";
    default:
      return "bg-gray-300 text-black";
  }
};

export default function ReportPage() {
  const userData = useRecoilValue<any>(userState);
  const [content, setContent] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      // Check if the file type is valid
      const acceptedFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!acceptedFileTypes.includes(file.type)) {
        toast({
          title: "Format de fichier non valide",
          description: "Veuillez choisir un fichier PDF ou une image (JPG, PNG)",
          variant: "destructive",
        });
        event.target.value = ""; // Reset the file input
        return;
      }
  
      // Check if the file size exceeds 5 MB
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeInBytes) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 5 Mo",
          variant: "destructive",
        });
        event.target.value = ""; // Reset the file input
        return;
      }
  
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier avant de l'envoyer",
        variant: "destructive",
      });
      return;
    }
  
    setUploading(true);
    
    try {
      // Prepare the file with a unique name
      const uploadFolderName = getUploadFolderName(userData.firstName, userData.lastName);
      const fileName = `report_${generateFileName()}.${ selectedFile.name.split('.').pop()}`;
      
      // Create a new file with the generated name
      const file = new File(
        [selectedFile],
        fileName,
        { type: selectedFile.type }
      );
      
      // Calculate checksum
      const checksum = await computeSHA256(file);
      
      // Get signed URL for S3 upload
      const signedURLResponse = await getSignedURL(
        `upload_mtym/${uploadFolderName}/${file.name}`, 
        file.type, 
        file.size, 
        checksum
      ) as any;
      
      // Upload the file to S3
      await uploadFile(signedURLResponse?.url, file) as any;
      
      // Update the application record with the report URL
      const reportUrl = `upload_mtym/${uploadFolderName}/${file.name}`;
      
      // Update application with the report URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}applications/${userData?.application?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reportUrl: reportUrl
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Rapport envoyé avec succès",
          description: "Votre rapport a été téléchargé et sera examiné par notre équipe",
        });
        
        // Refresh the page to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Erreur lors de la mise à jour de l'application");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur est survenue lors de l'envoi du fichier. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };  

  useEffect(() => {
    if (userData !== undefined) {
      setIsLoading(false);
    }

    // Check if user has a submitted application
    const hasSubmittedApplication = Boolean(
      userData?.application && 
      userData?.application?.status?.status !== 'DRAFT'
    );

    // If user hasn't submitted an application yet, set appropriate content
    if (!hasSubmittedApplication) {
      setContent({
        title: "Vous devez d'abord soumettre votre candidature",
        subtitle: "Veuillez compléter et soumettre votre candidature avant de pouvoir envoyer un rapport.",
        ctaLabel: "Accéder à ma candidature",
        redirectToApplication: true
      });
      return;
    }

    const application = userData?.application;
    const reportStatus = application?.status?.reportStatus || "PENDING";
    const hasReport = Boolean(application?.reportUrl);

    if (!hasReport) {
      setContent({
        title: "Vous n'avez pas encore envoyé de rapport",
        subtitle: "Veuillez envoyer votre rapport en cliquant sur le bouton ci-dessous.",
        ctaLabel: "Envoyer votre rapport",
      });
    } else {
      if (reportStatus === "VALID") {
        setContent({
          title: "Votre rapport a été approuvé",
          subtitle: "Votre rapport a été validé. Merci pour votre contribution.",
          ctaLabel: "Mettre à jour votre rapport",
        });
      } else if (reportStatus === "NOT_VALID") {
        setContent({
          title: "Votre rapport n'a pas été approuvé",
          subtitle: "Votre rapport n'a pas été validé. Veuillez le mettre à jour et le soumettre à nouveau.",
          ctaLabel: "Mettre à jour votre rapport",
        });
      } else {
        setContent({
          title: "Votre rapport est en cours d'examen",
          subtitle: "Votre rapport a été envoyé et est en cours d'examen par notre équipe.",
          ctaLabel: "Mettre à jour votre rapport",
        });
      }
    }
  }, [userData]);

  const handleButtonClick = () => {
    if (content?.redirectToApplication) {
      router.push(`/${userData?.locale || 'fr'}/profile/application`);
    } else {
      handleUpload();
    }
  };

  const reportCard = (
    <Card>
      <CardHeader>
        <CardTitle loading={isLoading}>{content?.title}</CardTitle>
        <CardDescription loading={isLoading}>{content?.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {userData?.application?.reportUrl && (
          <>
            <div className="text-sm">
              <span className="font-bold">Date d&apos;envoi</span>: {formatDate(userData?.application?.updatedAt)}
            </div>
            <div className="text-sm">
              <span className="font-bold">Status</span>:{" "}
              <Badge className={`px-4 ${getBadgeClassname(userData?.application?.status?.reportStatus)}`}>
                {userData?.application?.status?.reportStatus}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col space-y-4 w-full">
          {!content?.redirectToApplication && (
            <input 
              type="file" 
              accept="application/pdf,image/png,image/jpeg,image/jpg" 
              onChange={handleFileChange}
              className="w-full"
            />
          )}
          <Button onClick={handleButtonClick} disabled={!content?.redirectToApplication && (uploading || !selectedFile)} className="w-full">
            {uploading ? "Envoi en cours..." : content?.ctaLabel}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-medium">Rapport</div>
        <p className="text-sm text-muted-foreground">
          Retrouvez ici l&apos;état de votre rapport et téléchargez votre document.
        </p>
      </div>

      <Separator />

      {!userData ? <ProfileSkeleton /> : reportCard}
    </div>
  );
}