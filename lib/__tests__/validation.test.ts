import { describe, it, expect } from "vitest"
import {
  validateCourseForm,
  validateGradeForm,
  isCourseNameUnique,
  validateCourseBusinessRules,
  validateGradeBusinessRules,
} from "../validation"
import type { Course } from "@/types/course"
import type { Grade } from "@/types/grade"

describe("Validation", () => {
  describe("validateCourseForm", () => {
    it("should validate valid course data", () => {
      const result = validateCourseForm({
        name: "Veri Yapıları",
        code: "CSE201",
        credit: 3,
        semester: "2024-2025 Güz",
      })
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })

    it("should reject empty name", () => {
      const result = validateCourseForm({
        name: "",
        credit: 3,
        semester: "2024-2025 Güz",
      })
      expect(result.success).toBe(false)
    })

    it("should reject invalid credit", () => {
      const result = validateCourseForm({
        name: "Test Course",
        credit: 15,
        semester: "2024-2025 Güz",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("validateGradeForm", () => {
    it("should validate valid grade data", () => {
      const result = validateGradeForm({
        courseId: "123e4567-e89b-12d3-a456-426614174000",
        midterm: 80,
        quiz: 70,
        final: 85,
      })
      expect(result.success).toBe(true)
    })

    it("should reject invalid score", () => {
      const result = validateGradeForm({
        courseId: "123e4567-e89b-12d3-a456-426614174000",
        midterm: 150,
      })
      expect(result.success).toBe(false)
    })
  })

  describe("isCourseNameUnique", () => {
    const courses: Course[] = [
      {
        id: "1",
        name: "Course 1",
        credit: 3,
        semester: "2024-2025 Güz",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Course 2",
        credit: 4,
        semester: "2024-2025 Bahar",
        createdAt: new Date().toISOString(),
      },
    ]

    it("should return true for unique name", () => {
      expect(isCourseNameUnique("Course 3", courses)).toBe(true)
    })

    it("should return false for duplicate name", () => {
      expect(isCourseNameUnique("Course 1", courses)).toBe(false)
    })

    it("should exclude current course from check", () => {
      expect(isCourseNameUnique("Course 1", courses, "1")).toBe(true)
    })
  })

  describe("validateCourseBusinessRules", () => {
    const courses: Course[] = [
      {
        id: "1",
        name: "Existing Course",
        code: "EXIST",
        credit: 3,
        semester: "2024-2025 Güz",
        createdAt: new Date().toISOString(),
      },
    ]

    it("should pass for unique course", () => {
      const result = validateCourseBusinessRules(
        {
          name: "New Course",
          code: "NEW",
          credit: 3,
          semester: "2024-2025 Bahar",
        },
        courses
      )
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should fail for duplicate name", () => {
      const result = validateCourseBusinessRules(
        {
          name: "Existing Course",
          code: "NEW",
          credit: 3,
          semester: "2024-2025 Güz",
        },
        courses
      )
      expect(result.valid).toBe(false)
      expect(result.errors).toContain("Bu ders adı zaten kullanılıyor")
    })
  })

  describe("validateGradeBusinessRules", () => {
    const grades: Grade[] = []

    it("should require at least one grade", () => {
      const result = validateGradeBusinessRules(
        {
          courseId: "123e4567-e89b-12d3-a456-426614174000",
        },
        grades
      )
      expect(result.valid).toBe(false)
      expect(result.errors).toContain("En az bir not girmelisiniz")
    })

    it("should pass with at least one grade", () => {
      const result = validateGradeBusinessRules(
        {
          courseId: "123e4567-e89b-12d3-a456-426614174000",
          midterm: 80,
        },
        grades
      )
      expect(result.valid).toBe(true)
    })
  })
})

