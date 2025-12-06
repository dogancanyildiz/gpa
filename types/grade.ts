import { z } from "zod"

/**
 * Round a number up to the nearest integer
 * @param value The number to round up
 * @returns The rounded up integer value
 */
function roundUpToInteger(value: number): number {
  return Math.ceil(value)
}

// Zod schema for grade validation
export const gradeSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  midterm: z.number().min(0).max(100).optional(),
  quiz: z.number().min(0).max(100).optional(),
  final: z.number().min(0).max(100).optional(),
  totalScore: z.number().min(0).max(100).optional(),
  letterGrade: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
})

export type Grade = z.infer<typeof gradeSchema>

// Form schema (without id, totalScore, letterGrade and timestamps)
export const gradeFormSchema = z.object({
  courseId: z.string().uuid("Geçerli bir ders seçmelisiniz"),
  midterm: z
    .number({
      message: "Vize notu bir sayı olmalıdır",
    })
    .min(0, "Vize notu 0'dan küçük olamaz")
    .max(100, "Vize notu 100'den büyük olamaz")
    .optional()
    .or(z.literal(undefined)),
  quiz: z
    .number({
      message: "Kısa sınav notu bir sayı olmalıdır",
    })
    .min(0, "Kısa sınav notu 0'dan küçük olamaz")
    .max(100, "Kısa sınav notu 100'den büyük olamaz")
    .optional()
    .or(z.literal(undefined)),
  final: z
    .number({
      message: "Final notu bir sayı olmalıdır",
    })
    .min(0, "Final notu 0'dan küçük olamaz")
    .max(100, "Final notu 100'den büyük olamaz")
    .optional()
    .or(z.literal(undefined)),
})

export type GradeFormData = z.infer<typeof gradeFormSchema>

// Grade calculation constants (from grade-calculator.tsx)
export const GRADE_SCALE = [
  { letter: "AA", coefficient: 4.0, min: 90, max: 100 },
  { letter: "BA", coefficient: 3.5, min: 85, max: 89 },
  { letter: "BB", coefficient: 3.0, min: 75, max: 84 },
  { letter: "CB", coefficient: 2.5, min: 70, max: 74 },
  { letter: "CC", coefficient: 2.0, min: 60, max: 69 },
  { letter: "DC", coefficient: 1.5, min: 55, max: 59 },
  { letter: "DD", coefficient: 1.0, min: 50, max: 54 },
  { letter: "FD", coefficient: 0.5, min: 40, max: 49 },
  { letter: "FF", coefficient: 0.0, min: 0, max: 39 },
] as const

export type GradeInfo = typeof GRADE_SCALE[number]

// Calculate total score and letter grade
export function calculateGrade(
  midterm: number | undefined = 0,
  quiz: number | undefined = 0,
  final: number | undefined = 0
) {
  // Ortalama hesaplama (vize 37.5%, kısa sınav 12.5%)
  const midtermValue = midterm ?? 0
  const quizValue = quiz ?? 0
  const average = midtermValue * 0.375 + quizValue * 0.125
  
  // Final girildiyse toplam not hesaplama (final !== undefined kontrolü ile 0 değerini de kabul eder)
  const totalScore = final !== undefined ? average + final * 0.5 : null
  
  // Harf notu hesaplama - yuvarlanmış değer üzerinden yapılır
  // Böylece gösterilen not ile harf notu eşleşir (örn: 89.375 → 90 → AA)
  const roundedScore = totalScore !== null ? roundUpToInteger(totalScore) : null
  const letterGrade = roundedScore !== null ? getGradeLetter(roundedScore) : null
  
  return {
    totalScore,
    letterGrade: letterGrade?.letter,
    coefficient: letterGrade?.coefficient,
  }
}

// Get grade letter from score
function getGradeLetter(score: number): GradeInfo | null {
  // Negatif değerler için en düşük notu döndür
  if (score < 0) {
    return GRADE_SCALE[GRADE_SCALE.length - 1] // FF
  }
  
  // 100'den büyük değerler için en yüksek notu döndür
  if (score > 100) {
    return GRADE_SCALE[0] // AA
  }
  
  // Normal aralık kontrolü
  // Her aralık için: score >= min && score <= max
  for (const grade of GRADE_SCALE) {
    if (score >= grade.min && score <= grade.max) {
      return grade
    }
  }
  
  // Eğer hiçbir aralığa uymuyorsa (olması gerekmez ama güvenlik için)
  // En düşük notu döndür
  return GRADE_SCALE[GRADE_SCALE.length - 1] // FF
}

