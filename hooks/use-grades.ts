"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { Grade, GradeFormData } from "@/types/grade"
import { gradeSchema, calculateGrade } from "@/types/grade"
import {
  handleStorageError,
  getErrorMessage,
  isLocalStorageAvailable,
  ValidationError,
} from "@/lib/error-handler"
import {
  validateGradeForm,
  validateGradeBusinessRules,
} from "@/lib/validation"

const STORAGE_KEY = "gpa-grades"

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load grades from localStorage
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      toast.error("Tarayıcınız localStorage'ı desteklemiyor")
      setIsLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Grade[]
        // Validate with Zod
        const validated = parsed.filter((grade) => {
          const result = gradeSchema.safeParse(grade)
          if (!result.success) {
            console.warn("Invalid grade data:", grade, result.error)
          }
          return result.success
        })
        setGrades(validated)
      }
    } catch (error) {
      const storageError = handleStorageError(error, "Notlar yüklenirken")
      console.error("Error loading grades:", storageError)
      toast.error(getErrorMessage(storageError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save grades to localStorage
  const saveGrades = useCallback((newGrades: Grade[]) => {
    if (!isLocalStorageAvailable()) {
      toast.error("Tarayıcınız localStorage'ı desteklemiyor")
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newGrades))
      setGrades(newGrades)
    } catch (error) {
      const storageError = handleStorageError(error, "Notlar kaydedilirken")
      console.error("Error saving grades:", storageError)
      toast.error(getErrorMessage(storageError))
      throw storageError
    }
  }, [])

  // Add new grade
  const addGrade = useCallback(
    (data: GradeFormData) => {
      // Validate form data
      const formValidation = validateGradeForm(data)
      if (!formValidation.success) {
        const errorMessages = formValidation.errors?.issues
          .map((e: { message: string }) => e.message)
          .join(", ")
        toast.error(`Form hatası: ${errorMessages}`)
        return false
      }

      // Validate business rules
      const businessValidation = validateGradeBusinessRules(
        formValidation.data!,
        grades
      )
      if (!businessValidation.valid) {
        toast.error(businessValidation.errors.join(", "))
        return false
      }

      // Calculate total score and letter grade
      const calculation = calculateGrade(
        formValidation.data!.midterm || 0,
        formValidation.data!.quiz || 0,
        formValidation.data!.final || 0
      )

      const newGrade: Grade = {
        ...formValidation.data!,
        id: crypto.randomUUID(),
        totalScore: calculation.totalScore || undefined,
        letterGrade: calculation.letterGrade || undefined,
        createdAt: new Date().toISOString(),
      }

      // Final validation with Zod schema
      const validated = gradeSchema.safeParse(newGrade)
      if (!validated.success) {
        const error = new ValidationError("Geçersiz not verisi", validated.error.issues)
        toast.error(getErrorMessage(error))
        return false
      }

      try {
        saveGrades([...grades, validated.data])
        toast.success("Not başarıyla eklendi")
        return true
      } catch {
        return false
      }
    },
    [grades, saveGrades]
  )

  // Update existing grade
  const updateGrade = useCallback(
    (id: string, data: GradeFormData) => {
      // Validate form data
      const formValidation = validateGradeForm(data)
      if (!formValidation.success) {
        const errorMessages = formValidation.errors?.issues
          .map((e: { message: string }) => e.message)
          .join(", ")
        toast.error(`Form hatası: ${errorMessages}`)
        return false
      }

      // Validate business rules (excluding current grade)
      const businessValidation = validateGradeBusinessRules(
        formValidation.data!,
        grades,
        id
      )
      if (!businessValidation.valid) {
        toast.error(businessValidation.errors.join(", "))
        return false
      }

      // Calculate total score and letter grade
      const calculation = calculateGrade(
        formValidation.data!.midterm || 0,
        formValidation.data!.quiz || 0,
        formValidation.data!.final || 0
      )

      const updatedGrades = grades.map((grade) =>
        grade.id === id
          ? {
              ...grade,
              ...formValidation.data!,
              totalScore: calculation.totalScore || undefined,
              letterGrade: calculation.letterGrade || undefined,
              updatedAt: new Date().toISOString(),
            }
          : grade
      )

      // Validate all grades
      const validated = updatedGrades
        .map((grade) => {
          const result = gradeSchema.safeParse(grade)
          if (!result.success) {
            console.error("Invalid grade data:", grade, result.error)
            return null
          }
          return result.data
        })
        .filter((grade): grade is Grade => grade !== null)

      if (validated.length !== updatedGrades.length) {
        toast.error("Güncelleme başarısız: Geçersiz veri")
        return false
      }

      try {
        saveGrades(validated)
        toast.success("Not başarıyla güncellendi")
        return true
      } catch {
        return false
      }
    },
    [grades, saveGrades]
  )

  // Delete grade
  const deleteGrade = useCallback(
    (id: string) => {
      const updatedGrades = grades.filter((grade) => grade.id !== id)
      saveGrades(updatedGrades)
      toast.success("Not başarıyla silindi")
      return true
    },
    [grades, saveGrades]
  )

  // Get grade by ID
  const getGrade = useCallback(
    (id: string) => {
      return grades.find((grade) => grade.id === id)
    },
    [grades]
  )

  // Get grades by course ID
  const getGradesByCourse = useCallback(
    (courseId: string) => {
      return grades.filter((grade) => grade.courseId === courseId)
    },
    [grades]
  )

  return {
    grades,
    isLoading,
    addGrade,
    updateGrade,
    deleteGrade,
    getGrade,
    getGradesByCourse,
  }
}

