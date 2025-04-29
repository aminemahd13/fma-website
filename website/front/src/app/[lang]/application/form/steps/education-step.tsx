import { motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/shared/form"
import { Input, Separator } from "@/components/shared"
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/shared/select"

const RequiredAsterisk = () => <span className="text-red-500"> * </span>;

export const EducationStep = ({
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
        Études
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournissez des informations à propos de vos études et vos résultats scolaires
      </p>
      <Separator className='mt-4 bg-[#0284C7]'/>
      
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 justify-between'>
        {/* Highschool */}
        <FormField
          control={form.control}
          name="highschool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du lycée <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input placeholder="Nom de votre établissement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h2 className='text-base font-semibold leading-7 text-[#0284C7] mt-6'>
        Notes du 1er semestre
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournir les notes du contrôle continu du 1er semestre de l&apos;année en cours
      </p>
      <Separator className='mt-4 bg-[#0284C7]'/>
      
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-between'>
  <FormField
    control={form.control}
    name="averageGrade"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Contrôle Continu 1er semestre moyenne générale <RequiredAsterisk /></FormLabel>
        <FormControl>
          <Input placeholder="Votre moyenne générale" type="number" step="0.01" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="physicsAverageGrade"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Contrôle Continu 1er semestre moyenne de physique <RequiredAsterisk /></FormLabel>
        <FormControl>
          <Input placeholder="Votre moyenne en physique" type="number" step="0.01" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <FormField
    control={form.control}
    name="ranking"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Contrôle Continu 1er semestre classement général <RequiredAsterisk /></FormLabel>
        <FormControl>
          <Input placeholder="Votre classement" type="number" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {
  <FormField
    control={form.control}
    name="physicsRanking"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Contrôle Continu 1er semestre classement en physique</FormLabel>
        <FormDescription className="text-xs text-muted-foreground mt-0 mb-2">
          (facultatif)
        </FormDescription>
        <FormControl>
          <Input placeholder="Votre classement en physique" type="number" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  }
</div>
    </motion.div>
  )
}