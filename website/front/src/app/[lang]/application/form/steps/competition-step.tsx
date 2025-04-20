import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/form"
import { Separator, Textarea } from "@/components/shared"
import { RadioGroup, RadioGroupItem } from '@/components/shared/radio-group';

const RequiredAsterisk = () => <span className="text-red-500"> * </span>;

export const CompetitionStep = ({
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
        Compétition
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournissez des informations à propos de vos participations passées et vos motivations.
        <Separator className='mt-4 bg-[#0284C7]'/>
      </p>
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 justify-between'>
        {/* Has Previously Participated */}
        <FormField
          control={form.control}
          name="hasPreviouslyParticipated"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Avez-vous déjà participé à des compétitions (Olympiades, concours nationaux...)  <RequiredAsterisk /></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Oui
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Non
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Previous Participations */}
        <FormField
          control={form.control}
          name="previousCompetitions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Si oui, veuillez spécifier lesquelles et le résultat obtenu.</FormLabel>
              <FormControl>
              <Textarea
                placeholder="Parlez-nous de vos accomplissements"
                className="resize-none"
                {...field}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Has Previously Participated in MMC */}
        <FormField
          control={form.control}
          name="hasPreviouslyParticipatedInMtym"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Avez-vous participé à MFA in Mai 2024 ? <RequiredAsterisk /></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Oui
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Non
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="not-selected" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      J&apos;ai postulé, mais je n&apos;ai pas été sélectionné.
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='mt-10 grid grid-cols-1 gap-4 justify-between'>
        {/* Motivations */}
        <FormField
          control={form.control}
          name="motivations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parlez-nous de vos motivations à participer à cette compétition <RequiredAsterisk /></FormLabel>
              <FormControl>
              <Textarea
                placeholder="Maximum 300 mots"
                className="resize-none"
                {...field}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='mt-10 grid grid-cols-1 gap-4 justify-between'>
        {/* Comments */}
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarques / Commentaires</FormLabel>
              <FormControl>
              <Textarea
                placeholder="Quelque chose à ajouter ?"
                className="resize-none"
                {...field}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  )
}