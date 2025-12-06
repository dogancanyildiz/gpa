"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import type { Grade, GradeFormData } from "@/types/grade"
import { gradeSchema, calculateGrade } from "@/types/grade"

const STORAGE_KEY = "gpa-grades"

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load grades from localStorage
  useEffect(() => {
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
      console.error("Error loading grades:", error)
      toast.error("Notlar yüklenirken bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save grades to localStorage
  const saveGrades = useCallback((newGrades: Grade[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newGrades))
      setGrades(newGrades)
    } catch (error) {
      console.error("Error saving grades:", error)
      toast.error("Notlar kaydedilirken bir hata oluştu")
    }
  }, [])

  // Add new grade
  const addGrade = useCallback(
    (data: GradeFormData) => {
      // Calculate total score and letter grade
      const calculation = calculateGrade(
        data.midterm || 0,
        data.quiz || 0,
        data.final || 0
      )

      const newGrade: Grade = {
        ...data,
        id: crypto.randomUUID(),
        totalScore: calculation.totalScore || undefined,
        letterGrade: calculation.letterGrade || undefined,
        createdAt: new Date().toISOString(),
      }

      const validated = gradeSchema.safeParse(newGrade)
      if (!validated.success) {
        toast.error("Geçersiz not verisi")
        return false
      }

      const updatedGrades = [...grades, validated.data]
      saveGrades(updatedGrades)
      toast.success("Not başarıyla eklendi")
      return true
    },
    [grades, saveGrades]
  )

  // Update existing grade
  const updateGrade = useCallback(
    (id: string, data: GradeFormData) => {
      // Calculate total score and letter grade
      const calculation = calculateGrade(
        data.midterm || 0,
        data.quiz || 0,
        data.final || 0
      )

      const updatedGrades = grades.map((grade) =>
        grade.id === id
          ? {
              ...grade,
              ...data,
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
          return result.success ? result.data : null
        })
        .filter((grade): grade is Grade => grade !== null)

      saveGrades(validated)
      toast.success("Not başarıyla güncellendi")
      return true
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

