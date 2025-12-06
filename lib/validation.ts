import { courseFormSchema, type CourseFormData } from "@/types/course"
import { gradeFormSchema, type GradeFormData } from "@/types/grade"
import type { Course } from "@/types/course"
import type { Grade } from "@/types/grade"
import { z } from "zod"

/**
 * Validate course form data
 */
export function validateCourseForm(data: unknown): {
  success: boolean
  data?: CourseFormData
  errors?: z.ZodError
} {
  const result = courseFormSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Validate grade form data
 */
export function validateGradeForm(data: unknown): {
  success: boolean
  data?: GradeFormData
  errors?: z.ZodError
} {
  const result = gradeFormSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Check if course name is unique (case-insensitive)
 */
export function isCourseNameUnique(
  name: string,
  courses: Course[],
  excludeId?: string
): boolean {
  const normalizedName = name.trim().toLowerCase()
  return !courses.some(
    (course) =>
      course.name.trim().toLowerCase() === normalizedName &&
      course.id !== excludeId
  )
}

/**
 * Check if course code is unique (case-insensitive, optional)
 */
export function isCourseCodeUnique(
  code: string | undefined,
  courses: Course[],
  excludeId?: string
): boolean {
  if (!code || code.trim().length === 0) return true
  const normalizedCode = code.trim().toUpperCase()
  return !courses.some(
    (course) =>
      course.code &&
      course.code.trim().toUpperCase() === normalizedCode &&
      course.id !== excludeId
  )
}

/**
 * Validate course with business rules
 */
export function validateCourseBusinessRules(
  data: CourseFormData,
  courses: Course[],
  excludeId?: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check name uniqueness
  if (!isCourseNameUnique(data.name, courses, excludeId)) {
    errors.push("Bu ders adı zaten kullanılıyor")
  }

  // Check code uniqueness (if provided)
  if (data.code && !isCourseCodeUnique(data.code, courses, excludeId)) {
    errors.push("Bu ders kodu zaten kullanılıyor")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate grade with business rules
 */
export function validateGradeBusinessRules(
  data: GradeFormData,
  grades: Grade[],
  excludeId?: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check if at least one grade is provided
  if (!data.midterm && !data.quiz && !data.final) {
    errors.push("En az bir not girmelisiniz")
  }

  // Check if there's already a grade for this course (optional - can be removed if multiple grades per course are allowed)
  const existingGrade = grades.find(
    (grade) => grade.courseId === data.courseId && grade.id !== excludeId
  )
  if (existingGrade) {
    // This is a warning, not an error - allow multiple grades per course
    // errors.push("Bu ders için zaten bir not kaydı var")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

