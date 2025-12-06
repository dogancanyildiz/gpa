import { z } from "zod"

// Zod schema for course validation
export const courseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Ders adı gereklidir").max(100, "Ders adı çok uzun"),
  code: z.string().max(20, "Ders kodu çok uzun").optional(),
  credit: z.number().min(0).max(10).default(3),
  semester: z.string().min(1, "Dönem gereklidir").max(50, "Dönem çok uzun"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export type Course = z.infer<typeof courseSchema>

// Form schema (without id and timestamps)
export const courseFormSchema = z.object({
  name: z
    .string()
    .min(1, "Ders adı gereklidir")
    .max(100, "Ders adı en fazla 100 karakter olabilir")
    .trim()
    .refine((val) => val.length > 0, {
      message: "Ders adı boş olamaz",
    }),
  code: z
    .string()
    .max(20, "Ders kodu en fazla 20 karakter olabilir")
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true
        // Ders kodu formatı: harfler ve sayılar, opsiyonel tire/boşluk
        return /^[A-Z0-9\s-]+$/i.test(val)
      },
      {
        message: "Ders kodu sadece harf, sayı, tire ve boşluk içerebilir",
      }
    ),
  credit: z
    .number({
      message: "AKTS değeri bir sayı olmalıdır",
    })
    .min(0, "AKTS değeri 0'dan küçük olamaz")
    .max(10, "AKTS değeri 10'dan büyük olamaz")
    .int("AKTS değeri tam sayı olmalıdır"),
  semester: z
    .string()
    .min(1, "Dönem gereklidir")
    .max(50, "Dönem en fazla 50 karakter olabilir")
    .trim(),
})

export type CourseFormData = z.infer<typeof courseFormSchema>

