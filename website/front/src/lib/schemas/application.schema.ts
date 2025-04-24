import { isValidPhoneNumber } from "react-phone-number-input";
import { ZodSchema, z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ['image/png','image/jpeg','image/jpg', 'image/png','image/webp', 'application/pdf'];
const zodFileValidation = z.any()
  .refine(files => files?.length == 1, 'Ce fichier est obligatoire.')
  .refine(files => files ? ACCEPTED_FILE_TYPES.includes(files[0]?.type) : true, { message: 'Please choose PNG, JPEG or PDF format files only' })
  .refine(files => files ? files[0]?.size <= MAX_UPLOAD_SIZE : true, 'File size must be less than 3MB')

export const applicationSchema: ZodSchema = z.object({
  /* Personal Informations */
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  dateOfBirth: z.date({ required_error: "A date of birth is required." }),
  identityCardNumber: z.string().optional(),
  city: z.string().min(1).max(50),
  region: z.string().nonempty("Please select an option"),
  phoneNumber: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  guardianFullName: z.string().min(1).max(50),
  guardianPhoneNumber: z.string().refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide" }),
  relationshipWithGuardian: z.string().min(1).max(50),
  specialConditions: z.string().optional().refine((val) => {
    if (val) {
      return val.split(' ').length <= 100
    }
    return true;
  } , { message: "Maximum 100 mots"}),

  /* Education */
  educationLevel: z.string().nonempty("Please select an option"),
  educationField: z.string().nonempty("Please select an option"),
  highschool: z.string().min(1).max(50),
  averageGrade: z.string().min(1).max(50),
  mathAverageGrade: z.string().min(1).max(50),
  ranking: z.string().min(1).max(50),
  mathRanking: z.string().min(1).max(50),

  /* Competition */
  hasPreviouslyParticipated: z.enum(["yes", "no"], { required_error: "Please select an option." }),
  previousCompetitions: z.string().optional(),
  hasPreviouslyParticipatedInMtym: z.enum(["yes", "no", "not-selected"], { required_error: "Please select an option." }),
  motivations: z.string().min(1).refine(async text => text.split(' ').length <= 300, { message: "Text can't be more than 300 words", }),
  comments: z.string().optional().refine((val) => {
    if (val) {
      return val.split(' ').length <= 100
    }
    return true;
  } , { message: "Text can't be more than 100 words"}),

  /* Uploads */
  cnie: zodFileValidation,
  schoolCertificate: zodFileValidation,
  grades: zodFileValidation,
  regulations: zodFileValidation,
  parentalAuthorization: zodFileValidation,

  /* Terms of agreement */
  termsAgreement: z.boolean().default(false).refine(value => value === true, { message: "Vous devez accepter les Conditions Générales."}),
})

export const getApplicationDefaultValues = (userData: any) => ({
  firstName: userData?.firstName || "",
  lastName: userData?.lastName || "",
  dateOfBirth: "",
  identityCardNumber: "",
  city: "",
  region: "",
  phoneNumber: "",
  guardianFullName: "",
  guardianPhoneNumber: "",
  relationshipWithGuardian: "",
  specialConditions: "",

  educationLevel: "",
  educationField: "",
  highschool: "",
  averageGrade: "",
  mathAverageGrade: "",
  ranking: "",
  mathRanking: "",
  numberOfStudentsInClass: "",

  hasPreviouslyParticipated: "",
  previousCompetitions: "",
  hasPreviouslyParticipatedInMtym: "",
  motivations: "",
  comments: "",

  cnie: undefined,
  schoolCertificate: undefined,
  grades: undefined,
  regulations: undefined,
  parentalAuthorization: undefined,

  termsAgreement: false,
})