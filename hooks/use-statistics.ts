"use client"

import { useMemo } from "react"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { GRADE_SCALE } from "@/types/grade"
import type { Course } from "@/types/course"
import type { Grade } from "@/types/grade"

export interface Statistics {
  totalGPA: number
  totalCredits: number
  completedCredits: number
  courseCount: number
  gradeDistribution: Record<string, number>
  courseStats: CourseStat[]
}

export interface CourseStat {
  course: Course
  grade: Grade | null
  gpa: number
  credits: number
}

export function useStatistics() {
  const { courses } = useCourses()
  const { grades } = useGrades()

  const statistics = useMemo(() => {
    // Get grades with their courses
    const courseStats: CourseStat[] = courses.map((course) => {
      const grade = grades.find((g) => g.courseId === course.id && g.letterGrade)
      const gradeInfo = grade?.letterGrade
        ? GRADE_SCALE.find((g) => g.letter === grade.letterGrade)
        : null

      return {
        course,
        grade: grade || null,
        gpa: gradeInfo?.coefficient || 0,
        credits: course.credit,
      }
    })

    // Calculate total GPA (weighted by credits)
    const completedCourses = courseStats.filter((stat) => stat.grade !== null)
    const totalCredits = courseStats.reduce((sum, stat) => sum + stat.credits, 0)
    const completedCredits = completedCourses.reduce((sum, stat) => sum + stat.credits, 0)

    const totalGPA =
      completedCredits > 0
        ? completedCourses.reduce((sum, stat) => {
            return sum + stat.gpa * stat.credits
          }, 0) / completedCredits
        : 0

    // Grade distribution
    const gradeDistribution: Record<string, number> = {}
    completedCourses.forEach((stat) => {
      const letter = stat.grade?.letterGrade || "FF"
      gradeDistribution[letter] = (gradeDistribution[letter] || 0) + 1
    })

    return {
      totalGPA,
      totalCredits,
      completedCredits,
      courseCount: courses.length,
      gradeDistribution,
      courseStats,
    }
  }, [courses, grades])

  // Chart data for grade distribution (pie chart)
  const gradeDistributionData = useMemo(() => {
    return GRADE_SCALE.map((grade) => ({
      name: grade.letter,
      value: statistics.gradeDistribution[grade.letter] || 0,
      coefficient: grade.coefficient,
    })).filter((item) => item.value > 0)
  }, [statistics.gradeDistribution])

  // Chart data for course performance (bar chart)
  const coursePerformanceData = useMemo(() => {
    return statistics.courseStats
      .filter((stat) => stat.grade !== null)
      .map((stat) => ({
        name: stat.course.name,
        gpa: stat.gpa,
        score: stat.grade?.totalScore || 0,
        credits: stat.credits,
      }))
      .sort((a, b) => b.gpa - a.gpa)
  }, [statistics.courseStats])

  // Chart data for GPA trend (if we had semester data, but for now just show current)
  const gpaTrendData = useMemo(() => {
    // For now, just show current GPA
    // In future, this could be semester-based
    return [
      {
        period: "Mevcut",
        gpa: statistics.totalGPA,
      },
    ]
  }, [statistics.totalGPA])

  return {
    statistics,
    gradeDistributionData,
    coursePerformanceData,
    gpaTrendData,
  }
}

