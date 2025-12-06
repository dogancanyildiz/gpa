"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { Course, CourseFormData } from "@/types/course"
import { courseSchema } from "@/types/course"
import {
  handleStorageError,
  getErrorMessage,
  isLocalStorageAvailable,
  ValidationError,
} from "@/lib/error-handler"
import {
  validateCourseForm,
  validateCourseBusinessRules,
} from "@/lib/validation"

const STORAGE_KEY = "gpa-courses"

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load courses from localStorage
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      toast.error("Tarayıcınız localStorage'ı desteklemiyor")
      setIsLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Course[]
        
        // Migration: Add default semester to old courses that don't have it
        const migrated = parsed.map((course) => {
          if (!course.semester) {
            // Default to current semester
            const currentYear = new Date().getFullYear()
            const month = new Date().getMonth() + 1
            const semester = month >= 9 || month <= 1 ? "Güz" : "Bahar"
            const year = month >= 9 ? currentYear : currentYear - 1
            return {
              ...course,
              semester: `${year}-${year + 1} ${semester}`,
            }
          }
          return course
        })
        
        // Validate with Zod
        const validated = migrated.filter((course) => {
          const result = courseSchema.safeParse(course)
          if (!result.success) {
            console.warn("Invalid course data:", course, result.error)
          }
          return result.success
        })
        
        // Save migrated data if migration occurred
        if (migrated.length > 0 && migrated.some((c) => !parsed.find((p) => p.id === c.id && p.semester === c.semester))) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(validated))
          } catch (saveError) {
            console.warn("Failed to save migrated courses:", saveError)
          }
        }
        
        setCourses(validated)
      }
    } catch (error) {
      const storageError = handleStorageError(error, "Dersler yüklenirken")
      console.error("Error loading courses:", storageError)
      toast.error(getErrorMessage(storageError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save courses to localStorage
  const saveCourses = useCallback((newCourses: Course[]) => {
    if (!isLocalStorageAvailable()) {
      toast.error("Tarayıcınız localStorage'ı desteklemiyor")
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCourses))
      setCourses(newCourses)
    } catch (error) {
      const storageError = handleStorageError(error, "Dersler kaydedilirken")
      console.error("Error saving courses:", storageError)
      toast.error(getErrorMessage(storageError))
      throw storageError
    }
  }, [])

  // Add new course
  const addCourse = useCallback(
    (data: CourseFormData) => {
      // Validate form data
      const formValidation = validateCourseForm(data)
      if (!formValidation.success) {
        const errorMessages = formValidation.errors?.issues
          .map((e: { message: string }) => e.message)
          .join(", ")
        toast.error(`Form hatası: ${errorMessages}`)
        return false
      }

      // Validate business rules
      const businessValidation = validateCourseBusinessRules(
        formValidation.data!,
        courses
      )
      if (!businessValidation.valid) {
        toast.error(businessValidation.errors.join(", "))
        return false
      }

      const newCourse: Course = {
        ...formValidation.data!,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }

      // Final validation with Zod schema
      const validated = courseSchema.safeParse(newCourse)
      if (!validated.success) {
        const error = new ValidationError("Geçersiz ders verisi", validated.error.issues)
        toast.error(getErrorMessage(error))
        return false
      }

      try {
        saveCourses([...courses, validated.data])
        toast.success("Ders başarıyla eklendi")
        return true
      } catch {
        return false
      }
    },
    [courses, saveCourses]
  )

  // Update existing course
  const updateCourse = useCallback(
    (id: string, data: CourseFormData) => {
      // Validate form data
      const formValidation = validateCourseForm(data)
      if (!formValidation.success) {
        const errorMessages = formValidation.errors?.issues
          .map((e: { message: string }) => e.message)
          .join(", ")
        toast.error(`Form hatası: ${errorMessages}`)
        return false
      }

      // Validate business rules (excluding current course)
      const businessValidation = validateCourseBusinessRules(
        formValidation.data!,
        courses,
        id
      )
      if (!businessValidation.valid) {
        toast.error(businessValidation.errors.join(", "))
        return false
      }

      const updatedCourses = courses.map((course) =>
        course.id === id
          ? {
              ...course,
              ...formValidation.data!,
              updatedAt: new Date().toISOString(),
            }
          : course
      )

      // Validate all courses
      const validated = updatedCourses
        .map((course) => {
          const result = courseSchema.safeParse(course)
          if (!result.success) {
            console.error("Invalid course data:", course, result.error)
            return null
          }
          return result.data
        })
        .filter((course): course is Course => course !== null)

      if (validated.length !== updatedCourses.length) {
        toast.error("Güncelleme başarısız: Geçersiz veri")
        return false
      }

      try {
        saveCourses(validated)
        toast.success("Ders başarıyla güncellendi")
        return true
      } catch {
        return false
      }
    },
    [courses, saveCourses]
  )

  // Delete course
  const deleteCourse = useCallback(
    (id: string) => {
      const updatedCourses = courses.filter((course) => course.id !== id)
      saveCourses(updatedCourses)
      toast.success("Ders başarıyla silindi")
      return true
    },
    [courses, saveCourses]
  )

  // Get course by ID
  const getCourse = useCallback(
    (id: string) => {
      return courses.find((course) => course.id === id)
    },
    [courses]
  )

  return {
    courses,
    isLoading,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,
  }
}

