import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { Input, Separator } from "@/components/shared"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/form"
import Link from 'next/link';

const RequiredAsterisk = () => <span className="text-red-500"> * </span>;

export const UploadStep = ({
  form,
  delta,
}:{
  form: UseFormReturn,
  delta: number
}) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <h2 className='text-base font-semibold leading-7 text-[#0284C7]'>
        Documents à télécharger
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournissez les documents demandés (formats acceptés: PDF, JPG, PNG)
        <Separator className='mt-4 bg-[#0284C7]'/>
      </p>

      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 justify-between'>
        {/* Parent ID */}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => {
            if (field?.value && field?.value.length) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(field?.value[0]);
              setTimeout(() => {
                const fileInputElement = document.querySelector('#parentId') as HTMLInputElement;
                fileInputElement.files = dataTransfer.files;
              }, 300)
            }

            return (
              <FormItem>
                <FormLabel>Justificatif d&apos;identité des parents avec photo (carte d&apos;identité, passeport…) <RequiredAsterisk /></FormLabel>
                <FormControl>
                <Input
                  {...form.register("parentId", {
                    required: "Ce document est obligatoire",
                  })}
                  id="parentId"
                  type="file"
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Birth Certificate */}
        <FormField
          control={form.control}
          name="birthCertificate"
          render={({ field }) => {
            if (field?.value && field?.value.length) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(field?.value[0]);
              setTimeout(() => {
                const fileInputElement = document.querySelector('#birthCertificate') as HTMLInputElement;
                fileInputElement.files = dataTransfer.files;
              }, 300)
            }

            return (
              <FormItem>
                <FormLabel>Extrait d&apos;acte de naissance <RequiredAsterisk /></FormLabel>
                <FormControl>
                <Input
                  {...form.register("birthCertificate", {
                    required: "Ce document est obligatoire",
                  })}
                  id="birthCertificate"
                  type="file"
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* School Certificate */}
        <FormField
          control={form.control}
          name="schoolCertificate"
          render={({ field }) => {
            if (field?.value && field?.value.length) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(field?.value[0]);
              setTimeout(() => {
                const fileInputElement = document.querySelector('#schoolCertificate') as HTMLInputElement;
                fileInputElement.files = dataTransfer.files;
              }, 300)
            }

            return (
              <FormItem>
                <FormLabel>Certificat de scolarité pour l&apos;année 2024-2025 <RequiredAsterisk /></FormLabel>
                <FormControl>
                  <Input
                    {...form.register("schoolCertificate", {
                      required: "Ce document est obligatoire",
                    })}
                    id="schoolCertificate"
                    type="file"                      
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Transcript */}
        <FormField
          control={form.control}
          name="grades"
          render={({ field }) => {
            if (field?.value && field?.value.length) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(field?.value[0]);
              setTimeout(() => {
                const fileInputElement = document.querySelector('#grades') as HTMLInputElement;
                fileInputElement.files = dataTransfer.files;
              }, 300)
            }

            return (
              <FormItem>
                <FormLabel>Bulletin du 1er semestre (de l&apos;année en cours) <RequiredAsterisk /></FormLabel>
                <FormControl>
                  <Input
                    {...form.register("grades", {
                      required: "Ce document est obligatoire",
                    })}
                    id="grades"
                    type="file"
                  />
                </FormControl>
                <FormDescription>
                  <span className="text-blue-500">Remarque</span>: votre bulletin sera utilisé pour vérifier les notes que vous avez fournis précédemment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Regulations File */}
        <FormField
          control={form.control}
          name="regulations"
          render={({ field }) => {
            if (field?.value && field?.value.length) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(field?.value[0]);
              setTimeout(() => {
                const fileInputElement = document.querySelector('#regulations') as HTMLInputElement;
                fileInputElement.files = dataTransfer.files;
              }, 300)
            }

            return (
              <FormItem>
                <FormLabel>Règlement signé par l&apos;élève et le tuteur légal <RequiredAsterisk /></FormLabel>
                <FormControl>
                  <Input
                    {...form.register("regulations", {
                      required: "Ce document est obligatoire",
                    })}
                    id="regulations"
                    type="file"                    
                  />
                </FormControl>
                <FormDescription>
                  <span className="text-blue-500">Remarque</span>: Il faut l&apos;imprimer, le signer à la main puis le scanner. <span className="font-bold">Il n&apos;y a pas besoin de le légaliser</span>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Parental Authorization */}
        <FormField
          control={form.control}
          name="parentalAuthorization"
          render={({ field }) => {
            if (field?.value && field?.value.length) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(field?.value[0]);
              setTimeout(() => {
                const fileInputElement = document.querySelector('#parentalAuthorization') as HTMLInputElement;
                fileInputElement.files = dataTransfer.files;
              }, 300)
            }

            return (
              <FormItem>
                <FormLabel>Autorisation parentale signée et légalisée par le tuteur légal <RequiredAsterisk /></FormLabel>
                <FormControl>
                  <Input
                    {...form.register("parentalAuthorization", {
                      required: "Ce document est obligatoire",
                    })}
                    id="parentalAuthorization"
                    type="file"                    
                  />
                </FormControl>
                <FormDescription>
                    <span className="text-blue-500">Remarque</span>: il faut l&apos;imprimer, la signer à la main, la légaliser, puis le scanner; <span className="font-bold">la légalisation est obligatoire</span>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Image Rights */}
        <FormField
          control={form.control}
          name="imageRights"
          render={({ field }) => {
            if (field?.value && field?.value.length) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(field?.value[0]);
              setTimeout(() => {
                const fileInputElement = document.querySelector('#imageRights') as HTMLInputElement;
                fileInputElement.files = dataTransfer.files;
              }, 300)
            }

            return (
              <FormItem>
                <FormLabel>Droit de l&apos;image signé <RequiredAsterisk /></FormLabel>
                <FormControl>
                  <Input
                    {...form.register("imageRights", {
                      required: "Ce document est obligatoire",
                    })}
                    id="imageRights"
                    type="file"                    
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
    </motion.div>
  )
}