import { z } from "zod"

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"))

const passwordSchema = z
  .string()
  .min(8, "Password contain minimum 8 characters")
  .regex(/[a-z]/, "Password contain minimum 1 lowercase character")
  .regex(/[A-Z]/, "Password contain minimum 1 uppercase character")
  .regex(/[0-9]/, "Password contain minimum 1 number")

const nameSchema = z
  .string()
  .min(3, "Enter minimum 3 character")
  .max(100, "Maximum 100 character is allowed")
  .regex(/^[a-zA-Z\s]+$/, "Only alphabets are allowed")

const skillSchema = z
  .string()
  .trim()
  .min(1, "Skill cannot be empty")
  .max(30, "Maximum 30 characyer per skills")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password cannot be empty"),
})

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password cannot be empty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  })

export const skillsSchema = z
  .array(skillSchema)
  .max(10, "Maximum 10 skills allowed")
  .refine(
    (s) => new Set(s.map((v) => v.toLocaleLowerCase())).size === s.length,
    { message: "Duplicate skills are not allowed" },
  )

export const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  jobTitle: z
    .string()
    .trim()
    .max(100, "Maximum 100 character allowed")
    .optional(),
  location: z
    .string()
    .trim()
    .max(100, "Maximum 100 character is allowed")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, "Maximum 500 character is allowed")
    .optional(),
  skills: skillsSchema,
})

export type LoginData = z.infer<typeof loginSchema>
export type SignupData = z.infer<typeof signupSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
