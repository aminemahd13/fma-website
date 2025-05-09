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
                <FormDescription>
                  <span className="text-blue-500">Remarque</span>: Ce document doit être fourni par votre école et pour l&apos;année scolaire 2024/2025.
                </FormDescription>
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
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-blue-800">
         <span className="font-semibold">Note importante:</span> Les documents supplémentaires comme le justificatif d&apos;identité des parents, l&apos;extrait d&apos;acte de naissance, et les autorisations vous seront demandés uniquement si votre candidature est acceptée, dans la section &quot;Inscription Finale&quot; de votre profil.
        </p>
      </div>
    </motion.div>
  )
}