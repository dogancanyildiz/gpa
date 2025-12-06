"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Course } from "@/types/course"
import type { Grade } from "@/types/grade"
import { GRADE_SCALE } from "@/types/grade"

interface TranscriptViewProps {
  courses: Course[]
  grades: Grade[]
}

export function TranscriptView({ courses, grades }: TranscriptViewProps) {
  // Get course name by ID
  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course?.name || "Bilinmeyen Ders"
  }

  // Get course code by ID
  const getCourseCode = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course?.code || ""
  }

  // Get course credit by ID
  const getCourseCredit = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course?.credit || 0
  }

  // Calculate GPA for a grade
  const getGradeGPA = (letterGrade?: string) => {
    if (!letterGrade) return 0
    const gradeInfo = GRADE_SCALE.find((g) => g.letter === letterGrade)
    return gradeInfo?.coefficient || 0
  }

  // Prepare transcript data
  const transcriptData = useMemo(() => {
    return grades
      .map((grade) => {
        const course = courses.find((c) => c.id === grade.courseId)
        if (!course) return null

        return {
          course,
          grade,
          gpa: getGradeGPA(grade.letterGrade),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => {
        // Sort by course name
        return a.course.name.localeCompare(b.course.name, "tr")
      })
  }, [courses, grades])

  // Get grade badge variant
  const getGradeBadgeVariant = (letterGrade?: string) => {
    if (!letterGrade) return "secondary"
    const grade = GRADE_SCALE.find((g) => g.letter === letterGrade)
    if (!grade) return "secondary"

    if (grade.coefficient >= 3.5) return "default" // AA, BA
    if (grade.coefficient >= 2.5) return "secondary" // BB, CB
    if (grade.coefficient >= 1.5) return "outline" // CC, DC
    return "destructive" // DD, FD, FF
  }

  if (transcriptData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Henüz not girilmemiş. Transkript görüntülemek için önce notlarınızı ekleyin.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ders Adı</TableHead>
              <TableHead>Ders Kodu</TableHead>
              <TableHead className="text-right">AKTS</TableHead>
              <TableHead className="text-right">Vize</TableHead>
              <TableHead className="text-right">Kısa Sınav</TableHead>
              <TableHead className="text-right">Final</TableHead>
              <TableHead className="text-right">Toplam Not</TableHead>
              <TableHead className="text-right">Harf Notu</TableHead>
              <TableHead className="text-right">GPA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transcriptData.map(({ course, grade, gpa }) => (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>
                  {course.code ? (
                    <Badge variant="outline">{course.code}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">{course.credit}</TableCell>
                <TableCell className="text-right">
                  {grade.midterm !== undefined ? grade.midterm.toFixed(1) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {grade.quiz !== undefined ? grade.quiz.toFixed(1) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {grade.final !== undefined ? grade.final.toFixed(1) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {grade.totalScore !== undefined ? (
                    <span className="font-semibold">{grade.totalScore.toFixed(2)}</span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {grade.letterGrade ? (
                    <Badge variant={getGradeBadgeVariant(grade.letterGrade)}>
                      {grade.letterGrade}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {gpa > 0 ? (
                    <Badge variant={gpa >= 3.0 ? "default" : gpa >= 2.0 ? "secondary" : "destructive"}>
                      {gpa.toFixed(2)}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

