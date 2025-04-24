"use client"

import { useState } from "react"
import { FormSteps } from "./header/form-steps"
import { FormNavigation } from "./navigation/form-navigation"
import { PersonalInformationStep, EducationStep, CompetitionStep, UploadStep, ValidationStep } from "./steps"
import { useForm } from "react-hook-form"
import { applicationSchema, getApplicationDefaultValues } from "@/lib/schemas/application.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { computeSHA256, excludeFileFields, generateFileName, getUploadFolderName, sanitizeApplication } from "@/lib/utils"
import { z } from "zod"
import { Form } from "@/components/shared/form"
import { Button, Separator } from "@/components/shared"
import { toast } from "@/components/hooks/use-toast";
import { postApplication, putApplication, updateApplicationStatus } from "@/api/ApplicationApi"
import { useRouter } from "next/navigation"
import { getSignedURL, uploadFile } from "@/api/MediaApi"
import { LoadingDots } from "@/components/shared/icons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/dialog"

export const ApplicationForm = ({ 
  userData,
}: {
  userData: any,
}) => {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [error, setError] = useState<any>(undefined);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const router = useRouter()
  const delta = currentStep - previousStep
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: userData?.application 
      ? {...sanitizeApplication(userData?.application), firstName: userData?.firstName, lastName: userData?.lastName} 
      : getApplicationDefaultValues(userData),
    mode: "onChange",
  })

  const onSubmit = async (formData: z.infer<typeof applicationSchema>) => {
    setIsFormLoading(true);
    const { parentId, birthCertificate, schoolCertificate, grades, regulations, parentalAuthorization, imageRights } = formData;
    const uploadFolderName = getUploadFolderName(userData.firstName, userData.lastName);
    const uploadFileNames = ['parent_id', 'birth_certificate', 'school_certificate', 'grades', 'regulations', 'parental_authorization', 'image_rights']
      .map(name => `${name}_${generateFileName()}`)
    const files = [parentId, birthCertificate, schoolCertificate, grades, regulations, parentalAuthorization, imageRights]
      .map((files, index) => new File(
        [files[0]], 
        uploadFileNames[index] + '.' + files[0].name.split('.').pop(),
        { type: files[0].type },
      ))
    
    try {
      // Post application
      const applicationResponse = await postApplication(excludeFileFields(formData)) as any

      if (applicationResponse?.statusCode !== 200) {
        throw new Error(applicationResponse?.message ?? 'Post of application failed')
      }

      const applicationId = applicationResponse?.id;

      // Upload files
      for (const file of files) {
        const checksum = await computeSHA256(file);
        const signedURLResponse = await getSignedURL(`upload_mtym/${uploadFolderName}/${file.name}`, file.type, file.size, checksum) as any;
        await uploadFile(signedURLResponse?.url, file) as any;
      }

      // Update Application upload links
      await putApplication(applicationId, {
        parentIdUrl: `upload_mtym/${uploadFolderName}/${files[0].name}`,
        birthCertificateUrl: `upload_mtym/${uploadFolderName}/${files[1].name}`,
        schoolCertificateUrl: `upload_mtym/${uploadFolderName}/${files[2].name}`,
        gradesUrl: `upload_mtym/${uploadFolderName}/${files[3].name}`,
        regulationsUrl: `upload_mtym/${uploadFolderName}/${files[4].name}`,
        parentalAuthorizationUrl: `upload_mtym/${uploadFolderName}/${files[5].name}`,
        imageRightsUrl: `upload_mtym/${uploadFolderName}/${files[6].name}`,
      }) as any

      // Update Application status
      await updateApplicationStatus(applicationId, { status: userData?.application?.status?.status === 'NOTIFIED'
        ? 'UPDATED'
        : 'PENDING'
      }) as any;

      toast({
        title: 'Application created with success',
        description: 'You can access your current application in your profile page',
      });

      router.push(`/${userData?.locale || 'fr'}/profile/application`);
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    } catch(err: any) {
      setError(err);
      setShowErrorDialog(true);
    } finally {
      setIsFormLoading(false);
    }
  }

  const onSave = async () => {
    const application = form.watch()

    try {
      const applicationResponse = await postApplication(excludeFileFields(application)) as any;

      if (applicationResponse?.statusCode !== 200) {
        throw new Error(applicationResponse?.message ?? 'Post of application failed')
      }

      toast({
        title: 'Application saved successfully',
        description: 'You can access your current application in your profile page',
      });
      
      router.push(`/${userData?.locale || 'fr'}/profile/application`);
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    } catch(err: any) {
      setError(err);
      setShowErrorDialog(true);
    }    
  }

  const onError = async (errors: any) => {
    toast({
      title: "The form is invalid",
      description: "Not all required fields have been filled in.",
      variant: 'destructive',
    })
  }

  return (
    <section className='w-full inset-0 flex flex-col justify-between mt-6'>
      {/* Header */}
      <div className="flex justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Candidature</h2>
          <div className="text-muted-foreground">
            Suivez les étapes ci-dessous pour compléter votre candidature
          </div>
        </div>

        <div>
          <Button onClick={onSave}>Sauvegarder & Terminer plus tard</Button>
        </div>
      </div>
        
      <Separator className="my-6" />

      {/* Steps */}
      <FormSteps currentStep={currentStep} />

      {/* Navigation */}
      <FormNavigation
        currentStep={currentStep}
        form={form}
        setPreviousStep={setPreviousStep} 
        setCurrentStep={setCurrentStep} 
      />

      {/* Form */}
      <Form {...form}>
        <form className='mt-6' onSubmit={form.handleSubmit(onSubmit, onError)}>
          {/* Personal informations */}
          {currentStep === 0 && (
            <PersonalInformationStep form={form} delta={delta} />
          )}

          {currentStep === 1 && (
            <EducationStep form={form} delta={delta} />
          )}

          {currentStep === 2 && (
            <CompetitionStep form={form} delta={delta} />
          )}

          {currentStep === 3 && (
            <UploadStep form={form} delta={delta} />
          )}

          {currentStep === 4 && (
            <ValidationStep form={form} delta={delta} />
          )}

          {/* Submit Button */}
          {currentStep === 4 && (
            <div className='mt-20 text-center'> 
              <Button type="submit">
                {isFormLoading ? (
                  <LoadingDots color="#808080" />
                ) : (
                  <div>Soumettre ma candidature</div>
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
      
      

      {/* Navigation */}
      <FormNavigation
        variant="button"
        form={form}
        currentStep={currentStep} 
        setPreviousStep={setPreviousStep} 
        setCurrentStep={setCurrentStep} 
      />

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="my-2 text-red-700">La soumission de votre candidature a échouée</DialogTitle>
            <DialogDescription className="text-xs space-y-2">
              <div>
                Une erreur est survenue lors de la soumission de votre candidature. <br/>
                Message de l&apos;erreur: <span className="text-black">{error?.message} (app {userData?.application?.id ?? ''})</span>
              </div>
              <div>
                Veuillez réessayer plus tard <span className="text-black">ou</span> contactez-nous sur l&apos;addresse email <span className="text-blue-500">math.maroc.fma@gmail.com</span> en précisant votre nom, prénom et en joignant le message de l&apos;erreur çi-haut.
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}