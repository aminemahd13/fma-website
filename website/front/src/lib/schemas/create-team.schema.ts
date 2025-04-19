import { z } from "zod"

export const createTeamSchema = z.object({
  name: z.string().min(1, {message: 'A name is required'}),
  slogan: z.string().min(1, {message: 'A slogan is required'}),
  mentorFullname: z.string().optional(),
})

export const createTeamDefaultValues = {
  name: "",
  slogan: "",
  mentorFullname: "",
}