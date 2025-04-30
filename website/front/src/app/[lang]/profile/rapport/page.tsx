'use client';

import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { Separator } from "@/components/shared";
import ProfileSkeleton from "../profile-skeleton";
import { LoadingDots } from "@/components/shared/icons";
import { getUploadFolderName, generateFileName, computeSHA256, formatDate } from "@/lib/utils";
import { getSignedURL, uploadFile } from "@/api/MediaApi";
import { putApplication } from "@/api/ApplicationApi"; // Ensure putApplication is imported
import { getApplicationsOpenStatus } from "@/api/SettingsApi"; // Added import
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
  const [isApplicationsOpen, setIsApplicationsOpen] = useState<boolean>(true); // Add state for application status
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true); // Add state for checking status
  const router = useRouter();

  // Fetch application open status
  useEffect(() => {
    const checkApplicationStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const response = await getApplicationsOpenStatus() as any;
        if (response?.statusCode === 200) {
          setIsApplicationsOpen(response.isOpen);
        } else {
          // Default to closed if there's an error or unexpected response
          setIsApplicationsOpen(false);
        }
      } catch (error) {
        console.error("Failed to check application status", error);
        setIsApplicationsOpen(false); // Default to closed on error
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    checkApplicationStatus();
  }, []);

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
    if (!isApplicationsOpen) { // Add check for application status
      toast({
        title: "Soumissions fermées",
        description: "Les candidatures sont actuellement fermées. Vous ne pouvez pas soumettre de rapport.",
        variant: "destructive",
      });
      return;
    }

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
      
      // Update application with the report URL using the ApplicationApi
      const response = await putApplication(userData?.application?.id, {
        reportUrl: reportUrl
      }) as any;
      
      if (response?.statusCode === 200) {
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
    // If userData is loaded and status check is done, set isLoading to false
    if (userData !== undefined && !isCheckingStatus) {
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
      if (!isApplicationsOpen) { // Check if applications are closed
        setContent({
          title: "Les soumissions de rapports sont fermées",
          subtitle: "Les candidatures sont actuellement fermées, vous ne pouvez donc pas soumettre de rapport pour le moment.",
          ctaLabel: "Soumission fermée",
          redirectToApplication: false, // Keep user on this page, but disable upload
        });
      } else {
        setContent({
          title: "Vous n'avez pas encore envoyé de rapport",
          subtitle: "Veuillez envoyer votre rapport en cliquant sur le bouton ci-dessous.",
          ctaLabel: "Envoyer votre rapport",
        });
      }
    } else {
      if (reportStatus === "VALID") {
        setContent({
          title: "Votre rapport a été approuvé",
          subtitle: "Votre rapport a été validé. Merci pour votre contribution.",
          ctaLabel: "Mettre à jour votre rapport", // Or maybe "Voir le rapport" if updates aren't allowed after validation
        });
      } else if (reportStatus === "NOT_VALID") {
        if (!isApplicationsOpen) { // Also check here if applications are closed
           setContent({
            title: "Votre rapport n'a pas été approuvé",
            subtitle: "Votre rapport n'a pas été validé. Les soumissions sont actuellement fermées, vous ne pouvez pas le mettre à jour.",
            ctaLabel: "Soumission fermée",
          });
        } else {
          setContent({
            title: "Votre rapport n'a pas été approuvé",
            subtitle: "Votre rapport n'a pas été validé. Veuillez le mettre à jour et le soumettre à nouveau.",
            ctaLabel: "Mettre à jour votre rapport",
          });
        }
      } else { // PENDING
        if (!isApplicationsOpen) { // Also check here if applications are closed
           setContent({
            title: "Votre rapport est en cours d'examen",
            subtitle: "Votre rapport a été envoyé et est en cours d'examen. Les soumissions sont actuellement fermées, vous ne pouvez pas le mettre à jour.",
            ctaLabel: "Soumission fermée",
          });
        } else {
          setContent({
            title: "Votre rapport est en cours d'examen",
            subtitle: "Votre rapport a été envoyé et est en cours d'examen par notre équipe.",
            ctaLabel: "Mettre à jour votre rapport",
          });
        }
      }
    }
  }, [userData, isApplicationsOpen, isCheckingStatus]); // Add dependencies

  const handleButtonClick = () => {
    if (content?.redirectToApplication) {
      router.push(`/${userData?.locale || 'fr'}/profile/application`);
    } else if (isApplicationsOpen) { // Only call handleUpload if applications are open
      handleUpload();
    } else {
      // Optionally show a toast if the button is somehow clicked when closed
       toast({
        title: "Soumissions fermées",
        description: "Les candidatures sont actuellement fermées.",
        variant: "destructive",
      });
    }
  };

  const subjectsCard = (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Sujets disponibles</CardTitle>
        <CardDescription>
          Téléchargez le sujet qui correspond à votre niveau scolaire pour préparer votre rapport
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
            <div>
              <h4 className="font-medium">Sujet Tronc Commun</h4>
              <p className="text-sm text-muted-foreground">Pour les élèves en Tronc Commun</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <a href="/documents/sujet_tronc_commun.pdf" target="_blank" download>Télécharger</a>
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
            <div>
              <h4 className="font-medium">Sujet 1ère année Bac</h4>
              <p className="text-sm text-muted-foreground">Pour les élèves en 1ère année du Baccalauréat</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <a href="/documents/sujet_1ere_bac.pdf" target="_blank" download>Télécharger</a>
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Important :</strong> Veuillez télécharger et traiter le sujet correspondant à votre niveau actuel. 
              Votre rapport sera évalué en fonction des critères spécifiques à votre niveau.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Display loading skeleton while checking auth, data, or application status
  if (isLoading || userData === undefined || isCheckingStatus) {
    return <ProfileSkeleton />;
  }

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
          {/* Only show upload elements if applications are open and not redirecting */}
          {!content?.redirectToApplication && isApplicationsOpen && ( 
            <div className="flex flex-col w-full">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center border-dashed border-2 py-6"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  type="button"
                  // Disable file picker if report is VALID or NOT_VALID (and apps open)
                  disabled={userData?.application?.status?.reportStatus === 'VALID' || (userData?.application?.status?.reportStatus === 'NOT_VALID' && !isApplicationsOpen)}
                >
                  {selectedFile ? (
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                  ) : (
                    <>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mr-2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span className="text-sm font-medium">Choisir un fichier PDF, JPG ou PNG (max 5Mo)</span>
                    </>
                  )}
                </Button>
                <input 
                  id="file-upload"
                  type="file" 
                  accept="application/pdf,image/png,image/jpeg,image/jpg" 
                  onChange={handleFileChange}
                  className="sr-only"
                  // Also disable input if needed
                  disabled={userData?.application?.status?.reportStatus === 'VALID' || (userData?.application?.status?.reportStatus === 'NOT_VALID' && !isApplicationsOpen)}
                />
              </div>
              {selectedFile && (
                <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} Mo</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Disable button if applications are closed OR if redirecting OR if uploading OR (no file selected AND not redirecting) */}
          <Button 
            onClick={handleButtonClick} 
            disabled={!isApplicationsOpen || content?.redirectToApplication || uploading || (!selectedFile && !content?.redirectToApplication)} 
            className="w-full"
          >
            {uploading ? <LoadingDots color="#808080" /> : content?.ctaLabel}
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

      {/* No need for separate skeleton check here, handled by the main check */}
      <>
        {subjectsCard}
        {reportCard}
      </>
    </div>
  );
}