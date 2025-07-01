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
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const finalRegistrationSchema = z.object({  parentId: z.any()
    .refine(file => file?.length === 1, "Le justificatif d'identité des parents est requis")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),  birthCertificate: z.any()
    .refine(file => file?.length === 1, "L'extrait d'acte de naissance est requis")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),  regulations: z.any()
    .refine(file => file?.length === 1, "Le règlement signé est requis")
    .refine(
      file => file?.[0]?.size <= MAX_FILE_SIZE,
      "La taille du fichier ne doit pas dépasser 3MB"
    )
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format de fichier non valide. Utilisez PDF, JPG ou PNG."
    ),  parentalAuthorization: z.any()
    .refine(file => file?.length === 1, "L'autorisation parentale est requise")
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
  });
  
  // Formulaire pour la mise à jour individuelle des fichiers
  const updateForm = useForm<z.infer<typeof updateFileSchema>>({
    resolver: zodResolver(updateFileSchema),
    defaultValues: {
      parentId: { file: undefined },
      birthCertificate: { file: undefined },
      regulations: { file: undefined },
      parentalAuthorization: { file: undefined },
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
    },
  });

  useEffect(() => {
    // If user is not authenticated or doesn't have an accepted/waitlisted application, redirect
    if (userData) {
      setIsLoading(false);
      
      const hasAcceptedOrWaitlistedApplication = Boolean(
        userData?.application && 
        (userData?.application?.status?.status === 'ACCEPTED' || userData?.application?.status?.status === 'WAITLIST')
      );

      if (!hasAcceptedOrWaitlistedApplication) {
        router.push(`/${userData?.locale || 'fr'}/profile/application`);
        return;
      }
      
      // Check if the application is in a final state where edits are no longer allowed
      const applicationFinalized = Boolean(
        (userData?.application?.status?.status === 'ACCEPTED' || userData?.application?.status?.status === 'WAITLIST') && 
        userData?.application?.status?.parentIdStatus === 'VALID' &&
        userData?.application?.status?.birthCertificateStatus === 'VALID' &&
        userData?.application?.status?.regulationsStatus === 'VALID' &&
        userData?.application?.status?.parentalAuthorizationStatus === 'VALID'
      );
      
      // If application is finalized, disable all document selections
      if (applicationFinalized) {
        setSelectedDocuments({
          parentId: false,
          birthCertificate: false,
          regulations: false,
          parentalAuthorization: false,
        });
      } else {        // Disable selection of validated documents
        if (userData?.application) {
          const { status } = userData.application;
          
          setSelectedDocuments(prevState => {
            const updatedSelection = { ...prevState };
            
            if (status?.parentIdStatus === 'VALID') {
              updatedSelection.parentId = false;
            }
            if (status?.birthCertificateStatus === 'VALID') {
              updatedSelection.birthCertificate = false;
            }
            if (status?.regulationsStatus === 'VALID') {
              updatedSelection.regulations = false;
            }
            if (status?.parentalAuthorizationStatus === 'VALID') {
              updatedSelection.parentalAuthorization = false;
            }
            
            return updatedSelection;
          });
        }
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
        { field: 'parentalAuthorization', file: data.parentalAuthorization[0], prefix: 'parental_authorization' }
      ];

      // Process each document
      const uploadedFiles: Record<string, string> = {};
      
      for (const doc of documents) {
        const fileName = `${doc.prefix}_${generateFileName()}.${doc.file.name.split('.').pop()}`;
        const file = new File([doc.file], fileName, { type: doc.file.type });
        
        const checksum = await computeSHA256(file);
        const path = `upload_mtym/${uploadFolderName}/${fileName}`;
          // Get signed URL for S3 upload with proper validation
        const signedURLResponse = await getSignedURL(path, file.type, file.size, checksum) as any;
        
        if (!signedURLResponse?.url) {
          throw new Error(`Failed to get signed URL for ${doc.field} - server error`);
        }
          console.log(`Starting S3 upload for final registration file: ${fileName}`);
        
        // Upload file to S3 with comprehensive validation
        const uploadResponse = await uploadFile(signedURLResponse.url, file) as any;
        
        
        
        // CRITICAL: Enhanced validation for S3 upload - the function either resolves with success or rejects with error
        // If we reach this point, the upload was successful because uploadFile would have thrown an error otherwise
        if (!uploadResponse || !uploadResponse.success) {
          throw new Error(`S3 upload validation failed for ${doc.field} - unexpected response format`);
        }
        
        console.log(`✅ S3 upload verified successful for final registration file: ${fileName}`);
        
        // CRITICAL: Only store for database update if S3 upload was 100% successful
        uploadedFiles[`${doc.field}Url`] = path;
      }        // CRITICAL: Only update database after all S3 uploads are successful
      const response = await putApplication(userData.application.id, uploadedFiles) as any;

      if (response?.statusCode === 200) {
        console.log("Database update successful for final registration documents");
        toast({
          title: "Documents envoyés avec succès",
          description: "Votre inscription finale a été complétée avec succès.",
        });

        // Refresh page to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // If database update fails, files are already uploaded to S3, 
        // but we need to inform the user to contact support        throw new Error(`Database update failed - Status: ${response?.statusCode || 'unknown'}. Files uploaded to S3 but not recorded. Contact support with your name and this error.`);
      }
    } catch (error: any) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur lors de l'envoi",
        description: error.message || "Une erreur est survenue lors de l'envoi des documents. Veuillez réessayer.",
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
  const typedField = field as keyof typeof data;

  if (isSelected && data[typedField]?.file?.length > 0) {
    const fileData = data[typedField].file[0];          const prefixMap = {
            parentId: 'parent_id',
            birthCertificate: 'birth_certificate',
            regulations: 'regulations',
            parentalAuthorization: 'parental_authorization'
          };
          
          const prefix = prefixMap[field as keyof typeof prefixMap];
          const fileName = `${prefix}_${generateFileName()}.${fileData.name.split('.').pop()}`;
          const file = new File([fileData], fileName, { type: fileData.type });
          
          const checksum = await computeSHA256(file);
          const path = `upload_mtym/${uploadFolderName}/${fileName}`;
            // Get signed URL for S3 upload with proper validation
          const signedURLResponse = await getSignedURL(path, file.type, file.size, checksum) as any;
          
          if (!signedURLResponse?.url) {
            throw new Error(`Failed to get signed URL for ${field} - server error`);
          }
            console.log(`Starting S3 upload for individual file update: ${fileName}`);
          
          // Upload file to S3 with comprehensive validation
          const uploadResponse = await uploadFile(signedURLResponse.url, file) as any;
          
          
          
          // CRITICAL: Enhanced validation for S3 upload - the function either resolves with success or rejects with error
          // If we reach this point, the upload was successful because uploadFile would have thrown an error otherwise
          if (!uploadResponse || !uploadResponse.success) {
            throw new Error(`S3 upload validation failed for ${field} - unexpected response format`);
          }
          
          console.log(`✅ S3 upload verified successful for individual file update: ${fileName}`);
          
          // CRITICAL: Only store for database update if S3 upload was 100% successful
          uploadedFiles[`${field}Url`] = path;
          
          // Réinitialiser le statut du document à "PENDING"
          updatedStatuses[`${field}Status`] = 'PENDING';
        }
      }
        // Mettre à jour l'application avec les URLs des documents
      if (Object.keys(uploadedFiles).length > 0) {
        const applicationResponse = await putApplication(userData.application.id, uploadedFiles) as any;
        
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
    userData.application.parentalAuthorizationUrl
  );

  // Display a loading skeleton while checking auth and data
  if (isLoading || userData === undefined) {
    return <ProfileSkeleton />;
  }

  // If not accepted or waitlisted, show message (fallback if router redirect fails)
  if (userData?.application?.status?.status !== 'ACCEPTED' && userData?.application?.status?.status !== 'WAITLIST') {
    return (
      <div className="space-y-6">
        <div>
          <div className="text-lg font-medium">Inscription Finale</div>
          <p className="text-sm text-muted-foreground">
            Cette page est réservée aux candidats acceptés ou sur liste d&apos;attente.
          </p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
            <CardDescription>
              Cette page est uniquement accessible aux candidats dont la candidature a été acceptée ou mise sur liste d&apos;attente.
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
          {userData?.application?.status?.status === 'ACCEPTED' 
            ? "Félicitations ! Votre candidature a été acceptée. Pour finaliser votre inscription, veuillez fournir les documents requis ci-dessous."
            : "Votre candidature est sur liste d'attente. Vous pouvez déjà préparer vos documents d'inscription finale ci-dessous."}
        </p>
      </div>
      <Separator />

      {hasDocuments ? (
        <Card>
          <CardHeader>
            <CardTitle>Documents déjà soumis</CardTitle>
            <CardDescription>
              Vous avez déjà soumis vos documents d&apos;inscription finale. Si vous souhaitez 
              les mettre à jour, utilisez le formulaire ci-dessous.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {userData.application.parentIdUrl && (
                <li className="text-sm flex items-center justify-between">
                  <span>Justificatif d&apos;identité des parents</span>
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
                  <span>Extrait d&apos;acte de naissance</span>
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
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {/* Documents à télécharger */}
      <Card>
        <CardHeader>
          <CardTitle>Documents à télécharger</CardTitle>
          <CardDescription>
            Veuillez télécharger les documents suivants, les remplir, les signer et les soumettre via le formulaire ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <div>
                <h4 className="font-medium">Règlement</h4>
                <p className="text-sm text-muted-foreground">À signer par l&apos;élève et le tuteur légal</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0" asChild>
                <a href="/documents/reglement.pdf" target="_blank" download>Télécharger</a>
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <div>
                <h4 className="font-medium">Autorisation parentale</h4>
                <p className="text-sm text-muted-foreground">À signer et légaliser par le tuteur légal</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0" asChild>
                <a href="/documents/autorisation_parentale.pdf" target="_blank" download>Télécharger</a>
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Important :</strong> Après avoir téléchargé les documents, veuillez les imprimer, les signer et les scanner avant de les soumettre. L&apos;autorisation parentale doit également être légalisée.
            </p>
          </div>
        </CardContent>
      </Card>

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
                        <FormLabel>Justificatif d&apos;identité des parents avec photo</FormLabel>
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
                          Carte d&apos;identité, passeport ou autre document officiel avec photo
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
                        <FormLabel>Extrait d&apos;acte de naissance</FormLabel>
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
                        <FormLabel>Règlement signé par l&apos;élève et le tuteur légal</FormLabel>
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
                          Il faut l&apos;<strong>imprimer</strong>, le <strong>signer</strong> à la main puis le <strong>scanner</strong>. Il n&apos;y a <strong>pas besoin de le légaliser</strong>.
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
                          Il faut l&apos;<strong>imprimer</strong>, la <strong>signer</strong> à la main, la <strong>légaliser</strong>, puis la <strong>scanner</strong>. <strong>La légalisation est obligatoire</strong>.
                        </FormDescription>
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
                  <strong>Note:</strong> Chaque document mis à jour sera automatiquement placé en statut &quot;En attente&quot; de validation.
                  <br />
                  <strong>Important:</strong> Les documents déjà validés ne peuvent plus être modifiés.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.application.parentIdUrl && (
                    <div className={`p-4 border rounded-md ${userData.application.status?.parentIdStatus === 'VALID' ? 'bg-green-50' : ''}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="parentId-checkbox" 
                          checked={selectedDocuments.parentId}
                          disabled={userData.application.status?.parentIdStatus === 'VALID'}
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
                          Justificatif d&apos;identité des parents
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
                      {userData.application.status?.parentIdStatus === 'VALID' && (
                        <p className="text-xs text-green-700 mt-1 mb-2">
                          Ce document a été validé et ne peut plus être modifié.
                        </p>
                      )}
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
                    <div className={`p-4 border rounded-md ${userData.application.status?.birthCertificateStatus === 'VALID' ? 'bg-green-50' : ''}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="birthCertificate-checkbox" 
                          checked={selectedDocuments.birthCertificate}
                          disabled={userData.application.status?.birthCertificateStatus === 'VALID'}
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
                          Extrait d&apos;acte de naissance
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
                      {userData.application.status?.birthCertificateStatus === 'VALID' && (
                        <p className="text-xs text-green-700 mt-1 mb-2">
                          Ce document a été validé et ne peut plus être modifié.
                        </p>
                      )}
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
                    <div className={`p-4 border rounded-md ${userData.application.status?.regulationsStatus === 'VALID' ? 'bg-green-50' : ''}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="regulations-checkbox" 
                          checked={selectedDocuments.regulations}
                          disabled={userData.application.status?.regulationsStatus === 'VALID'}
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
                      {userData.application.status?.regulationsStatus === 'VALID' && (
                        <p className="text-xs text-green-700 mt-1 mb-2">
                          Ce document a été validé et ne peut plus être modifié.
                        </p>
                      )}
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
                    <div className={`p-4 border rounded-md ${userData.application.status?.parentalAuthorizationStatus === 'VALID' ? 'bg-green-50' : ''}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Checkbox 
                          id="parentalAuthorization-checkbox" 
                          checked={selectedDocuments.parentalAuthorization}
                          disabled={userData.application.status?.parentalAuthorizationStatus === 'VALID'}
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
                      {userData.application.status?.parentalAuthorizationStatus === 'VALID' && (
                        <p className="text-xs text-green-700 mt-1 mb-2">
                          Ce document a été validé et ne peut plus être modifié.
                        </p>
                      )}
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