import { z } from "zod"

// Zod schema for course validation
export const courseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Ders adı gereklidir").max(100, "Ders adı çok uzun"),
  code: z.string().max(20, "Ders kodu çok uzun").optional(),
  credit: z.number().min(0).max(10).default(3),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export type Course = z.infer<typeof courseSchema>

// Form schema (without id and timestamps)
export const courseFormSchema = z.object({
  name: z.string().min(1, "Ders adı gereklidir").max(100, "Ders adı çok uzun"),
  code: z.string().max(20, "Ders kodu çok uzun").optional(),
  credit: z.number().min(0).max(10),
})

export type CourseFormData = z.infer<typeof courseFormSchema>

