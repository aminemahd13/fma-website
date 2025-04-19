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

const educationLevels = [
  {label: "Tronc commun", value:"tronc-commun"},
  {label: "1ère année Bac", value:"1bac"},
  {label: "2ème année Bac", value:"2bac"},
]

const educationFields = [
  {label: "TC sciences", value:"tc-sciences"},
  {label: "TC technologique", value:"tc-technologique"},
  {label: "1BAC Sciences Economiques et Gestion", value:"1bac-sciences-economiques-et-gestion"},
  {label: "1BAC Arts Appliqués", value:"1bac-arts-appliques"},
  {label: "1BAC Sciences Expérimentales", value:"1bac-sciences-experimentales"},
  {label: "1BAC Sciences Mathématiques", value:"1bac-sciences-mathematiques"},
  {label: "1BAC Sciences et Technologies Electriques", value:"1bac-sciences-et-technologies-electriques"},
  {label: "1BAC Sciences et Technologies Mécaniques", value:"1bac-sciences-et-technologies-mecaniques"},
  {label: "2BAC Sciences Economiques", value:"2bac-sciences-economiques"},
  {label: "2BAC Sciences de Gestion et Comptabilité", value:"2bac-sciences-de-gestion-et-comptabilite"},
  {label: "2BAC Arts Appliqués", value:"2bac-arts-appliques "},
  {label: "2BAC Sciences de la Vie et de la Terre", value:"2bac-sciences-de-la-vie-et-de-la-terre"},
  {label: "2BAC Sciences Physique Chimie", value:"2bac-sciences-physique-chimie"},
  {label: "2BAC Sciences Agronomiques", value:"2bac-sciences-agronomiques"},
  {label: "2BAC Sciences Mathématiques A", value:"2bac-sciences-mathematiques-a"},
  {label: "2BAC Sciences Mathématiques B", value:"2bac-sciences-mathematiques-b"},
  {label: "2BAC Sciences et Technologies Electrique", value:"2bac-sciences-et-technologies-electrique"},
  {label: "2BAC Sciences et Technologies Mécanique", value:"2bac-sciences-et-technologies-mecanique"},
  {label: "Autre", value:"autre"},
]

const RequiredAsterisk = () => <span className="text-red-500"> * </span>;

export const CreateTeamForm = ({
  form,
  delta,
}:{
  form: UseFormReturn<any>,
  delta: number
}) => {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <h2 className='text-base font-semibold leading-7 text-[#0284C7]'>
        Créer une nouvelle équipe
      </h2>

      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournissez des informations à propos de votre équipe
        <Separator className='mt-4 bg-[#0284C7]'/>
      </p>

      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 justify-between'>
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;équipe<RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'équipe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slogan */}
        <FormField
          control={form.control}
          name="slogan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slogan <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input placeholder="Slogan de l'équipe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mentor Full Name*/}
        <FormField
          control={form.control}
          name="mentorFullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom et Nom de votre mentor</FormLabel>
              <FormControl>
                <Input placeholder="Nom complet du mentor" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                Si votre équipe a un mentor (enseignant, chercheur, etc.), veuillez indiquer son nom complet ci-dessus.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  )
}