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
import { formatDate } from "@/lib/utils";

const getBadgeClassname = (status: string) => {
  switch (status) {
    case "NOT_SENT":
      return "bg-gray-300 text-black";
    case "SENT":
      return "bg-[#79F2C0] text-black";
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
  
      // Check if the file size exceeds 5 MB
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSizeInBytes) {
        alert("La taille du fichier ne doit pas dépasser 5 Mo.");
        event.target.value = ""; // Reset the file input
        return;
      }
  
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Fichier envoyé avec succès !");
        router.refresh(); // Refresh the page to reflect changes
      } else {
        alert("Erreur lors de l'envoi du fichier.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (userData !== undefined) {
      setIsLoading(false);
    }

    const report = userData?.report;
    const reportStatus = report?.status;

    if (!report) {
      setContent({
        title: "Vous n'avez pas encore envoyé de rapport",
        subtitle: "Veuillez envoyer votre rapport en cliquant sur le bouton ci-dessous.",
        ctaLabel: "Envoyer votre rapport",
      });
    } else if (reportStatus === "NOT_SENT") {
      setContent({
        title: "Votre rapport n'a pas encore été envoyé",
        subtitle: "Vous pouvez envoyer votre rapport dès maintenant.",
        ctaLabel: "Envoyer votre rapport",
      });
    } else if (reportStatus === "SENT") {
      setContent({
        title: "Votre rapport a été envoyé",
        subtitle: "Merci pour votre envoi. Vous trouverez les détails ci-dessous.",
        ctaLabel: "Mettre à jour votre rapport",
      });
    }
  }, [userData]);

  const reportCard = (
    <Card>
      <CardHeader>
        <CardTitle loading={isLoading}>{content?.title}</CardTitle>
        <CardDescription loading={isLoading}>{content?.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {userData?.report && (
          <>
            <div className="text-sm">
              <span className="font-bold">Date d&apos;envoi</span>: {formatDate(userData?.report?.sentAt)}
            </div>
            <div className="text-sm">
              <span className="font-bold">Status</span>:{" "}
              <Badge className={`px-4 ${getBadgeClassname(userData?.report?.status)}`}>
                {userData?.report?.status}
              </Badge>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col space-y-4">
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={uploading}>
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
        <p className="text-sm text-muted-foreground">Retrouvez ici l&apos;état de votre rapport.</p>
      </div>

      <Separator />

      {!userData ? <ProfileSkeleton /> : reportCard}
    </div>
  );
}