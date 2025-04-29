import React from 'react'
import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
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
  // Get the current values to conditionally render questions
  const physicsOlympiadsValue = form.watch("physicsOlympiadsParticipation");
  const hasPreviouslyParticipatedValue = form.watch("hasPreviouslyParticipated");

  // Reset olympiadsTrainingSelection when physicsOlympiadsValue changes to "no"
  React.useEffect(() => {
    if (physicsOlympiadsValue === "no") {
      form.setValue("olympiadsTrainingSelection", undefined);
    }
  }, [physicsOlympiadsValue, form]);
  
  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <h2 className='text-base font-semibold leading-7 text-[#0284C7]'>
        Feynman Moroccan Adventure (FMA)
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournissez des informations à propos de vos expériences et participations
      </p>
      <Separator className='mt-4 bg-[#0284C7]'/>

      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 justify-between'>
        {/* Previous competitions */}
        <FormField
          control={form.control}
          name="hasPreviouslyParticipated"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Avez-vous déjà participé à des compétitions ou toute autre expérience que vous pensez être utile pour votre candidature? <RequiredAsterisk /></FormLabel>
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

        {/* Previous competitions details - Only show if hasPreviouslyParticipated is "yes" */}
        {hasPreviouslyParticipatedValue === "yes" && (
          <FormField
            control={form.control}
            name="previousCompetitions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Si oui : lesquelles ?</FormLabel>
                <FormControl>
                <Textarea
                  placeholder="Décrivez vos expériences précédentes"
                  className="resize-none"
                  {...field}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Physics olympiads participation */}
        <FormField
          control={form.control}
          name="physicsOlympiadsParticipation"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Êtes-vous participant aux olympiades de physique cette année? <RequiredAsterisk /></FormLabel>
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

        {/* Selected for July training - Only show if olympiads participation is "yes" */}
        {physicsOlympiadsValue === "yes" && (
          <FormField
            control={form.control}
            name="olympiadsTrainingSelection"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Êtes-vous sélectionné au stage de formation de juillet ?</FormLabel>
                <FormDescription className="text-xs mt-0 mb-2">
                  (Question pour les élèves de 1ere Bac)
                </FormDescription>
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
        )}
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
                placeholder="Avez-vous quelque chose à ajouter ?"
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