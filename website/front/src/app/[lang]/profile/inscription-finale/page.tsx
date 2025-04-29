"use client";

import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useAuthGuard } from "@/components/hooks/use-auth-guard";
import { useRouter } from "next/navigation";
import { Button, Separator, Checkbox } from "@/components/shared";
import { Input } from "@/components/shared";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/shared/card";
import ProfileSkeleton from "../profile-skeleton";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/shared/form";
import { toast } from "@/components/hooks/use-toast";
import { computeSHA256, getUploadFolderName, generateFileName } from "@/lib/utils";
import { getSignedURL, uploadFile } from "@/api/MediaApi";
import { putApplication, updateApplicationStatus } from "@/api/ApplicationApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the validation schema for final registration documents
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const finalRegistrationSchema = z.object({
  parentId: z.any()
    .refine(file => file?.length === 1, "Le justificatif d'identité des parents est requis")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),
  birthCertificate: z.any()
    .refine(file => file?.length === 1, "L'extrait d'acte de naissance est requis")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),
  regulations: z.any()
    .refine(file => file?.length === 1, "Le règlement signé est requis")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),
  parentalAuthorization: z.any()
    .refine(file => file?.length === 1, "L'autorisation parentale est requise")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),
  imageRights: z.any()
    .refine(file => file?.length === 1, "Le droit à l'image signé est requis")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),
});

// Définir un schéma conditionnel pour les mises à jour individuelles
const individualFileSchema = z.object({
  file: z.any()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.length > 0) {
        // Vérifier la taille du fichier
        if (val[0]?.size > MAX_FILE_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La taille du fichier ne doit pas dépasser 3MB",
          });
        }
        
        // Vérifier le type du fichier
        if (!ACCEPTED_FILE_TYPES.includes(val[0]?.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Format de fichier non valide. Utilisez PDF, JPG ou PNG.",
          });
        }
      }
    }),
});

// Nouveaux types pour la mise à jour individuelle des fichiers
const updateFileSchema = z.object({
  parentId: individualFileSchema,
  birthCertificate: individualFileSchema,
  regulations: individualFileSchema,
  parentalAuthorization: individualFileSchema,
  imageRights: individualFileSchema,
});

export default function InscriptionFinalePage() {
  const userData = useRecoilValue<any>(userState);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<Record<string, boolean>>({
    parentId: false,
    birthCertificate: false,
    regulations: false,
    parentalAuthorization: false,
    imageRights: false
  });
  
  // Formulaire pour la mise à jour individuelle des fichiers
  const updateForm = useForm<z.infer<typeof updateFileSchema>>({
    resolver: zodResolver(updateFileSchema),
    defaultValues: {
      parentId: { file: undefined },
      birthCertificate: { file: undefined },
      regulations: { file: undefined },
      parentalAuthorization: { file: undefined },
      imageRights: { file: undefined },
    },
  });
  
  // Call useAuthGuard without trying to destructure anything from it
  useAuthGuard();

  // Create form with zod validation
  const form = useForm<z.infer<typeof finalRegistrationSchema>>({
    resolver: zodResolver(finalRegistrationSchema),
    defaultValues: {
      parentId: undefined,
      birthCertificate: undefined,
      regulations: undefined,
      parentalAuthorization: undefined,
      imageRights: undefined,
    },
  });

  useEffect(() => {
    // If user is not authenticated or doesn't have an accepted application, redirect
    if (userData) {
      setIsLoading(false);
      
      const hasAcceptedApplication = Boolean(
        userData?.application && 
        userData?.application?.status?.status === 'ACCEPTED'
      );

      if (!hasAcceptedApplication) {
        router.push(`/${userData?.locale || 'fr'}/profile/application`);
      }
    }
  }, [userData, router]);

  const onSubmit = async (data: z.infer<typeof finalRegistrationSchema>) => {
    if (!userData?.application?.id) {
      toast({
        title: "Erreur",
        description: "Impossible de trouver votre candidature",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare folder and file names
      const uploadFolderName = getUploadFolderName(userData.firstName, userData.lastName);
      
      // Convert form files to File objects with unique names
      const documents = [
        { field: 'parentId', file: data.parentId[0], prefix: 'parent_id' },
        { field: 'birthCertificate', file: data.birthCertificate[0], prefix: 'birth_certificate' },
        { field: 'regulations', file: data.regulations[0], prefix: 'regulations' },
        { field: 'parentalAuthorization', file: data.parentalAuthorization[0], prefix: 'parental_authorization' },
        { field: 'imageRights', file: data.imageRights[0], prefix: 'image_rights' }
      ];

      // Process each document
      const uploadedFiles: Record<string, string> = {};
      
      for (const doc of documents) {
        const fileName = `${doc.prefix}_${generateFileName()}.${doc.file.name.split('.').pop()}`;
        const file = new File([doc.file], fileName, { type: doc.file.type });
        
        const checksum = await computeSHA256(file);
        const path = `upload_mtym/${uploadFolderName}/${fileName}`;
        
        // Get signed URL for S3 upload
        const signedURLResponse = await getSignedURL(path, file.type, file.size, checksum) as any;
        
        // Upload file to S3
        await uploadFile(signedURLResponse?.url, file);
        
        // Store the path for database update
        uploadedFiles[`${doc.field}Url`] = path;
      }
      
      // Update application with document URLs
      const response = await putApplication(userData.application.id, uploadedFiles);

      if (response) {
        toast({
          title: "Documents envoyés avec succès",
          description: "Votre inscription finale a été complétée avec succès.",
        });

        // Refresh page to show updated status
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
        description: "Une erreur est survenue lors de l'envoi des documents. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour gérer la mise à jour individuelle des documents
  const handleUpdateSelectedFiles = async (data: z.infer<typeof updateFileSchema>) => {
    if (!userData?.application?.id) {
      toast({
        title: "Erreur",
        description: "Impossible de trouver votre candidature",
        variant: "destructive",
      });
      return;
    }

    // Vérifier si au moins un document est sélectionné
    const hasSelectedDocuments = Object.values(selectedDocuments).some(value => value);
    if (!hasSelectedDocuments) {
      toast({
        title: "Aucun document sélectionné",
        description: "Veuillez sélectionner au moins un document à mettre à jour",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer le dossier de téléchargement
      const uploadFolderName = getUploadFolderName(userData.firstName, userData.lastName);
      
      // Documents à mettre à jour et statuts à réinitialiser
      const uploadedFiles: Record<string, string> = {};
      const updatedStatuses: Record<string, string> = {};
      
      // Traiter chaque document sélectionné
      for (const [field, isSelected] of Object.entries(selectedDocuments)) {
        if (isSelected && data[field].file?.length > 0) {
          const fileData = data[field].file[0];
          const prefixMap = {
            parentId: 'parent_id',
            birthCertificate: 'birth_certificate',
            regulations: 'regulations',
            parentalAuthorization: 'parental_authorization',
            imageRights: 'image_rights'
          };
          
          const prefix = prefixMap[field];
          const fileName = `${prefix}_${generateFileName()}.${fileData.name.split('.').pop()}`;
          const file = new File([fileData], fileName, { type: fileData.type });
          
          const checksum = await computeSHA256(file);
          const path = `upload_mtym/${uploadFolderName}/${fileName}`;
          
          // Obtenir l'URL signée pour le téléchargement S3
          const signedURLResponse = await getSignedURL(path, file.type, file.size, checksum) as any;
          
          // Télécharger le fichier sur S3
          await uploadFile(signedURLResponse?.url, file);
          
          // Stocker le chemin pour la mise à jour de la base de données
          uploadedFiles[`${field}Url`] = path;
          
          // Réinitialiser le statut du document à "PENDING"
          updatedStatuses[`${field}Status`] = 'PENDING';
        }
      }
      
      // Mettre à jour l'application avec les URLs des documents
      if (Object.keys(uploadedFiles).length > 0) {
        const applicationResponse = await putApplication(userData.application.id, uploadedFiles);
        
        // Mettre à jour les statuts des documents
        if (Object.keys(updatedStatuses).length > 0) {
          await updateApplicationStatus(userData.application.id, updatedStatuses);
        }

        if (applicationResponse) {
          toast({
            title: "Documents mis à jour avec succès",
            description: "Les documents sélectionnés ont été mis à jour et seront examinés à nouveau.",
          });

          // Rafraîchir la page pour afficher le statut mis à jour
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: "Une erreur est survenue lors de la mise à jour des documents. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if any documents are already submitted
  const hasDocuments = userData?.application && (
    userData.application.parentIdUrl || 
    userData.application.birthCertificateUrl || 
    userData.application.regulationsUrl || 
    userData.application.parentalAuthorizationUrl || 
    userData.application.imageRightsUrl
  );

  // Display a loading skeleton while checking auth and data
  if (isLoading || userData === undefined) {
    return <ProfileSkeleton />;
  }

  // If not accepted, show message (fallback if router redirect fails)
  if (userData?.application?.status?.status !== 'ACCEPTED') {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-lg font-medium">Inscription Finale</div>
          <p className="text-sm text-muted-foreground">
            Cette page est réservée aux candidats acceptés.
          </p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
            <CardDescription>
              Cette page est uniquement accessible aux candidats dont la candidature a été acceptée.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push(`/${userData?.locale || 'fr'}/profile/application`)}>
              Retour à ma candidature
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-medium">Inscription Finale</div>
        <p className="text-sm text-muted-foreground">
          Félicitations ! Votre candidature a été acceptée. Pour finaliser votre inscription, 
          veuillez fournir les documents requis ci-dessous.
        </p>
      </div>
      <Separator />

      {hasDocuments ? (
        <Card>
          <CardHeader>
            <CardTitle>Documents déjà soumis</CardTitle>
            <CardDescription>
              Vous avez déjà soumis vos documents d'inscription finale. Si vous souhaitez 
              les mettre à jour, utilisez le formulaire ci-dessous.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {userData.application.parentIdUrl && (
                <li className="text-sm flex items-center justify-between">
                  <span>Justificatif d'identité des parents</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userData.application.status?.parentIdStatus === 'VALID' 
                      ? 'bg-green-100 text-green-800' 
                      : userData.application.status?.parentIdStatus === 'NOT_VALID'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userData.application.status?.parentIdStatus === 'VALID' 
                      ? 'Validé' 
                      : userData.application.status?.parentIdStatus === 'NOT_VALID'
                        ? 'Non validé'
                        : 'En attente'}
                  </span>
                </li>
              )}
              {userData.application.birthCertificateUrl && (
                <li className="text-sm flex items-center justify-between">
                  <span>Extrait d'acte de naissance</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userData.application.status?.birthCertificateStatus === 'VALID' 
                      ? 'bg-green-100 text-green-800' 
                      : userData.application.status?.birthCertificateStatus === 'NOT_VALID'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userData.application.status?.birthCertificateStatus === 'VALID' 
                      ? 'Validé' 
                      : userData.application.status?.birthCertificateStatus === 'NOT_VALID'
                        ? 'Non validé'
                        : 'En attente'}
                  </span>
                </li>
              )}
              {userData.application.regulationsUrl && (
                <li className="text-sm flex items-center justify-between">
                  <span>Règlement signé</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userData.application.status?.regulationsStatus === 'VALID' 
                      ? 'bg-green-100 text-green-800' 
                      : userData.application.status?.regulationsStatus === 'NOT_VALID'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userData.application.status?.regulationsStatus === 'VALID' 
                      ? 'Validé' 
                      : userData.application.status?.regulationsStatus === 'NOT_VALID'
                        ? 'Non validé'
                        : 'En attente'}
                  </span>
                </li>
              )}
              {userData.application.parentalAuthorizationUrl && (
                <li className="text-sm flex items-center justify-between">
                  <span>Autorisation parentale</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userData.application.status?.parentalAuthorizationStatus === 'VALID' 
                      ? 'bg-green-100 text-green-800' 
                      : userData.application.status?.parentalAuthorizationStatus === 'NOT_VALID'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userData.application.status?.parentalAuthorizationStatus === 'VALID' 
                      ? 'Validé' 
                      : userData.application.status?.parentalAuthorizationStatus === 'NOT_VALID'
                        ? 'Non validé'
                        : 'En attente'}
                  </span>
                </li>
              )}
              {userData.application.imageRightsUrl && (
                <li className="text-sm flex items-center justify-between">
                  <span>Droit à l'image signé</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    userData.application.status?.imageRightsStatus === 'VALID' 
                      ? 'bg-green-100 text-green-800' 
                      : userData.application.status?.imageRightsStatus === 'NOT_VALID'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userData.application.status?.imageRightsStatus === 'VALID' 
                      ? 'Validé' 
                      : userData.application.status?.imageRightsStatus === 'NOT_VALID'
                        ? 'Non validé'
                        : 'En attente'}
                  </span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {!hasDocuments ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Documents requis</CardTitle>
                <CardDescription>
                  Veuillez fournir tous les documents demandés ci-dessous (formats acceptés: PDF, JPG, PNG).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Parent ID */}
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Justificatif d'identité des parents avec photo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                              }
                            }}
                            {...rest}
                          />
                        </FormControl>
                        <FormDescription>
                          Carte d'identité, passeport ou autre document officiel avec photo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Birth Certificate */}
                  <FormField
                    control={form.control}
                    name="birthCertificate"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Extrait d'acte de naissance</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                              }
                            }}
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Regulations */}
                  <FormField
                    control={form.control}
                    name="regulations"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Règlement signé par l'élève et le tuteur légal</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                              }
                            }}
                            {...rest}
                          />
                        </FormControl>
                        <FormDescription>
                          Il faut l'<strong>imprimer</strong>, le <strong>signer</strong> à la main puis le <strong>scanner</strong>. Il n'y a <strong>pas besoin de le légaliser</strong>.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Parental Authorization */}
                  <FormField
                    control={form.control}
                    name="parentalAuthorization"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Autorisation parentale signée et légalisée par le tuteur légal</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                              }
                            }}
                            {...rest}
                          />
                        </FormControl>
                        <FormDescription>
                          Il faut l'<strong>imprimer</strong>, la <strong>signer</strong> à la main, la <strong>légaliser</strong>, puis la <strong>scanner</strong>. <strong>La légalisation est obligatoire</strong>.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Rights */}
                  <FormField
                    control={form.control}
                    name="imageRights"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Droit de l'image signé</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files?.length) {
                                onChange(files);
                              }
                            }}
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi en cours..." : "Soumettre les documents"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      ) : (
        <Form {...updateForm}>
          <form onSubmit={updateForm.handleSubmit(handleUpdateSelectedFiles)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Mettre à jour les documents</CardTitle>
                <CardDescription>
                  Sélectionnez les documents que vous souhaitez mettre à jour, puis téléchargez les nouvelles versions.
                  <br />
                  <strong>Note:</strong> Chaque document mis à jour sera automatiquement placé en statut "En attente" de validation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.application.parentIdUrl && (
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="parentId-checkbox" 
                          checked={selectedDocuments.parentId}
                          onCheckedChange={(checked) => 
                            setSelectedDocuments(prev => ({
                              ...prev, 
                              parentId: Boolean(checked)
                            }))
                          }
                        />
                        <label 
                          htmlFor="parentId-checkbox" 
                          className="font-medium cursor-pointer"
                        >
                          Justificatif d'identité des parents
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${
                          userData.application.status?.parentIdStatus === 'VALID' 
                            ? 'bg-green-100 text-green-800' 
                            : userData.application.status?.parentIdStatus === 'NOT_VALID'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {userData.application.status?.parentIdStatus === 'VALID' 
                            ? 'Validé' 
                            : userData.application.status?.parentIdStatus === 'NOT_VALID'
                              ? 'Non validé'
                              : 'En attente'}
                        </span>
                      </div>
                      {selectedDocuments.parentId && (
                        <FormField
                          control={updateForm.control}
                          name="parentId.file"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files?.length) {
                                      onChange(files);
                                    }
                                  }}
                                  {...rest}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {userData.application.birthCertificateUrl && (
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="birthCertificate-checkbox" 
                          checked={selectedDocuments.birthCertificate}
                          onCheckedChange={(checked) => 
                            setSelectedDocuments(prev => ({
                              ...prev, 
                              birthCertificate: Boolean(checked)
                            }))
                          }
                        />
                        <label 
                          htmlFor="birthCertificate-checkbox" 
                          className="font-medium cursor-pointer"
                        >
                          Extrait d'acte de naissance
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${
                          userData.application.status?.birthCertificateStatus === 'VALID' 
                            ? 'bg-green-100 text-green-800' 
                            : userData.application.status?.birthCertificateStatus === 'NOT_VALID'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {userData.application.status?.birthCertificateStatus === 'VALID' 
                            ? 'Validé' 
                            : userData.application.status?.birthCertificateStatus === 'NOT_VALID'
                              ? 'Non validé'
                              : 'En attente'}
                        </span>
                      </div>
                      {selectedDocuments.birthCertificate && (
                        <FormField
                          control={updateForm.control}
                          name="birthCertificate.file"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files?.length) {
                                      onChange(files);
                                    }
                                  }}
                                  {...rest}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {userData.application.regulationsUrl && (
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="regulations-checkbox" 
                          checked={selectedDocuments.regulations}
                          onCheckedChange={(checked) => 
                            setSelectedDocuments(prev => ({
                              ...prev, 
                              regulations: Boolean(checked)
                            }))
                          }
                        />
                        <label 
                          htmlFor="regulations-checkbox" 
                          className="font-medium cursor-pointer"
                        >
                          Règlement signé
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${
                          userData.application.status?.regulationsStatus === 'VALID' 
                            ? 'bg-green-100 text-green-800' 
                            : userData.application.status?.regulationsStatus === 'NOT_VALID'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {userData.application.status?.regulationsStatus === 'VALID' 
                            ? 'Validé' 
                            : userData.application.status?.regulationsStatus === 'NOT_VALID'
                              ? 'Non validé'
                              : 'En attente'}
                        </span>
                      </div>
                      {selectedDocuments.regulations && (
                        <FormField
                          control={updateForm.control}
                          name="regulations.file"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files?.length) {
                                      onChange(files);
                                    }
                                  }}
                                  {...rest}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {userData.application.parentalAuthorizationUrl && (
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="parentalAuthorization-checkbox" 
                          checked={selectedDocuments.parentalAuthorization}
                          onCheckedChange={(checked) => 
                            setSelectedDocuments(prev => ({
                              ...prev, 
                              parentalAuthorization: Boolean(checked)
                            }))
                          }
                        />
                        <label 
                          htmlFor="parentalAuthorization-checkbox" 
                          className="font-medium cursor-pointer"
                        >
                          Autorisation parentale
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${
                          userData.application.status?.parentalAuthorizationStatus === 'VALID' 
                            ? 'bg-green-100 text-green-800' 
                            : userData.application.status?.parentalAuthorizationStatus === 'NOT_VALID'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {userData.application.status?.parentalAuthorizationStatus === 'VALID' 
                            ? 'Validé' 
                            : userData.application.status?.parentalAuthorizationStatus === 'NOT_VALID'
                              ? 'Non validé'
                              : 'En attente'}
                        </span>
                      </div>
                      {selectedDocuments.parentalAuthorization && (
                        <FormField
                          control={updateForm.control}
                          name="parentalAuthorization.file"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files?.length) {
                                      onChange(files);
                                    }
                                  }}
                                  {...rest}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {userData.application.imageRightsUrl && (
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="imageRights-checkbox" 
                          checked={selectedDocuments.imageRights}
                          onCheckedChange={(checked) => 
                            setSelectedDocuments(prev => ({
                              ...prev, 
                              imageRights: Boolean(checked)
                            }))
                          }
                        />
                        <label 
                          htmlFor="imageRights-checkbox" 
                          className="font-medium cursor-pointer"
                        >
                          Droit à l'image signé
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${
                          userData.application.status?.imageRightsStatus === 'VALID' 
                            ? 'bg-green-100 text-green-800' 
                            : userData.application.status?.imageRightsStatus === 'NOT_VALID'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {userData.application.status?.imageRightsStatus === 'VALID' 
                            ? 'Validé' 
                            : userData.application.status?.imageRightsStatus === 'NOT_VALID'
                              ? 'Non validé'
                              : 'En attente'}
                        </span>
                      </div>
                      {selectedDocuments.imageRights && (
                        <FormField
                          control={updateForm.control}
                          name="imageRights.file"
                          render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files?.length) {
                                      onChange(files);
                                    }
                                  }}
                                  {...rest}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !Object.values(selectedDocuments).some(v => v)}
                >
                  {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour les documents sélectionnés"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      )}
    </div>
  );
}