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
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/shared/select"
import { Input, Separator, Textarea } from "@/components/shared"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/popover"
import { Calendar } from "@/components/shared"
import { CalendarIcon } from "@radix-ui/react-icons"
import { PhoneInput } from "@/components/shared/phone-input"
import { cn } from '@/lib/utils'
import { Button } from "@/components/shared"
import { format } from "date-fns"
import Link from 'next/link'

const regions = [
  {label: "Tanger-Tétouan-Al Hoceïma", value:"tanger-tetouan-al-houceima"},
  {label: "Oriental", value:"oriental"},
  {label: "Fès-Meknès", value:"fes-meknes"},
  {label: "Rabat-Salé-Kénitra", value:"rabat-sale-kenitra"},
  {label: "Béni Mellal-Khénifra", value:"beni-mellal-khenifra"},
  {label: "Casablanca-Settat", value:"casablanca-settat"},
  {label: "Marrakech-Safi", value:"marrakech-safi"},
  {label: "Drâa-Tafilalet", value:"draa-tafilalet"},
  {label: "Souss-Massa", value:"souss-massa"},
  {label: "Guelmim-Oued Noun", value:"guelmim-oued-noun"},
  {label: "Laâyoune-Sakia El Hamra", value:"laayoune-sakia-el-hamra"},
  {label: "Dakhla-Oued Eddahab", value:"dakhla-oued-eddahab"},
]

const relationshipsWithGuardian = [
  {label: "Père", value:"father"},
  {label: "Mère", value:"mother"},
  {label: "Tuteur", value:"guardian"},
]

const RequiredAsterisk = () => <span className="text-red-500"> * </span>;

export const PersonalInformationStep = ({
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
      <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200">
        <p className="text-sm text-blue-800">
          La lecture attentive et entière du <Link href="#" className="text-blue-600 underline font-medium">règlement</Link> est obligatoire
        </p>
      </div>
      
      <h2 className='text-base font-semibold leading-7 text-[#0284C7]'>
        Informations personnelles de l&apos;élève
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournissez les informations personnelles de l&apos;élève.
      </p>
      <Separator className='mt-4 bg-[#0284C7]'/>
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between'>
        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input disabled placeholder="Prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input disabled placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of birth */}
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-2">
              <FormLabel>Date de naissance <RequiredAsterisk /></FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Choisis une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="single"
                    captionLayout="dropdown"
                    fromYear={1990} 
                    toYear={2010}
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Student Massar Code */}
        <FormField
          control={form.control}
          name="massarCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Massar ou Code National de l'Etudiant (CNE) <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input placeholder="Code Massar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville actuelle de résidence <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input placeholder="Ville" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Region */}
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Région actuelle de résidence <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une région" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectGroup>
                      <SelectLabel>Régions</SelectLabel>
                      {regions.map(region =>
                        <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-2 items-start">
              <FormLabel className="text-left">Téléphone de l'élève <RequiredAsterisk /></FormLabel>
              <FormControl className="w-full">
                <PhoneInput placeholder="Numéro de téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className='mt-6 grid grid-cols-1 gap-4 justify-between'>
        {/* Special conditions */}
        <FormField
          control={form.control}
          name="specialConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avez-vous des problèmes de santé, des allergies, ou toute autre information que nous devons connaître pour vous assurer des conditions adéquates sur place?</FormLabel>
              <FormControl>
              <Textarea
                placeholder="Maximum 100 mots"
                className="resize-none"
                {...field}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <h2 className='text-base font-semibold leading-7 text-[#0284C7] mt-6'>
        Informations personnelles du parent
      </h2>
      <p className='mt-1 text-sm leading-6 text-gray-600'>
        Fournissez les informations personnelles d&apos;un parent.
      </p>
      <Separator className='mt-4 bg-[#0284C7]'/>
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between'>
        {/* Guardian Full Name */}
        <FormField
          control={form.control}
          name="guardianFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom et prénom du parent <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input placeholder="Nom complet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Parent CNIE */}
        <FormField
          control={form.control}
          name="parentCNIE"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro CNIE des parents <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Input placeholder="CNIE du parent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    
        {/* Guardian Phone Number */}
        <FormField
          control={form.control}
          name="guardianPhoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-2 items-start">
              <FormLabel className="text-left">Téléphone d'un parent <RequiredAsterisk /></FormLabel>
              <FormControl className="w-full">
                <PhoneInput placeholder="Numéro de téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Relationship with Guardian */}
        <FormField
          control={form.control}
          name="relationshipWithGuardian"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relation avec ce parent <RequiredAsterisk /></FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Relation</SelectLabel>
                      {relationshipsWithGuardian.map(relationship => 
                        <SelectItem key={relationship.value} value={relationship.value}>{relationship.label}</SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  )
}