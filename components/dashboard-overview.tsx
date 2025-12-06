"use client"

import { IconPlus, IconBook, IconFileText, IconTrendingUp, IconChartBar, IconChartDonut } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useStatistics } from "@/hooks/use-statistics"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import Link from "next/link"
import { GradeDistributionChart } from "@/components/grade-distribution-chart"
import { roundUp, roundUpToInteger } from "@/lib/utils"

export function DashboardOverview() {
  const { statistics, gradeDistributionData } = useStatistics()
  const { courses, isLoading: coursesLoading } = useCourses()
  const { grades, isLoading: gradesLoading } = useGrades()
  
  const isLoading = coursesLoading || gradesLoading

  // Get recent courses (last 3)
  const recentCourses = courses.slice(-3).reverse()

  // Get recent grades (last 3)
  const recentGrades = grades.slice(-3).reverse()

  // Get course name by ID
  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    return course?.name || "Bilinmeyen Ders"
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600 dark:text-green-400"
    if (gpa >= 3.0) return "text-blue-600 dark:text-blue-400"
    if (gpa >= 2.5) return "text-yellow-600 dark:text-yellow-400"
    if (gpa >= 2.0) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ana Sayfa</h1>
        <p className="text-muted-foreground">
          Akademik performansınızın özeti ve hızlı erişim
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/courses">
          <Button variant="outline" className="w-full h-auto flex-col items-start p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconPlus className="h-5 w-5" />
              <span className="font-semibold">Yeni Ders Ekle</span>
            </div>
            <span className="text-sm text-muted-foreground text-left">
              Yeni bir ders ekleyin
            </span>
          </Button>
        </Link>
        <Link href="/grades">
          <Button variant="outline" className="w-full h-auto flex-col items-start p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconFileText className="h-5 w-5" />
              <span className="font-semibold">Yeni Not Ekle</span>
            </div>
            <span className="text-sm text-muted-foreground text-left">
              Ders notu girin
            </span>
          </Button>
        </Link>
        <Link href="/statistics">
          <Button variant="outline" className="w-full h-auto flex-col items-start p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconChartBar className="h-5 w-5" />
              <span className="font-semibold">İstatistikler</span>
            </div>
            <span className="text-sm text-muted-foreground text-left">
              Detaylı analiz görüntüle
            </span>
          </Button>
        </Link>
        <Link href="/reports">
          <Button variant="outline" className="w-full h-auto flex-col items-start p-4">
            <div className="flex items-center gap-2 mb-2">
              <IconBook className="h-5 w-5" />
              <span className="font-semibold">Raporlar</span>
            </div>
            <span className="text-sm text-muted-foreground text-left">
              Transkript görüntüle
            </span>
          </Button>
        </Link>
      </div>

      {/* Overview Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Genel GPA</CardTitle>
              <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.totalGPA > 0 ? (
                  <span className={getGPAColor(statistics.totalGPA)}>
                    {roundUp(statistics.totalGPA)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.completedCredits > 0
                  ? `${statistics.completedCredits} AKTS tamamlandı`
                  : "Henüz not girilmemiş"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam AKTS</CardTitle>
              <IconBook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalCredits}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.completedCredits} AKTS tamamlandı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ders Sayısı</CardTitle>
              <IconChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.courseCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.courseStats.filter((s) => s.grade !== null).length} ders tamamlandı
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanma Oranı</CardTitle>
              <IconChartDonut className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.totalCredits > 0
                  ? `${Math.round((statistics.completedCredits / statistics.totalCredits) * 100)}%`
                  : "0%"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.completedCredits} / {statistics.totalCredits} AKTS
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts and Recent Items */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Grade Distribution Chart */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Harf Notu Dağılımı</CardTitle>
              <CardDescription>
                Derslerinizin harf notu dağılımı
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gradeDistributionData.length > 0 ? (
                <GradeDistributionChart data={gradeDistributionData} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <IconChartDonut className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Henüz not girilmemiş
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Items */}
        <div className="space-y-4">
          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son Eklenen Dersler</CardTitle>
                <Link href="/courses">
                  <Button variant="ghost" size="sm">
                    Tümünü Gör
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentCourses.length > 0 ? (
                <div className="space-y-3">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{course.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {course.code && (
                            <Badge variant="outline" className="text-xs">
                              {course.code}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {course.semester}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {course.credit} AKTS
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <IconBook className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Henüz ders eklenmemiş
                  </p>
                  <Link href="/courses">
                    <Button variant="outline" size="sm" className="mt-2">
                      İlk Dersinizi Ekleyin
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son Eklenen Notlar</CardTitle>
                <Link href="/grades">
                  <Button variant="ghost" size="sm">
                    Tümünü Gör
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentGrades.length > 0 ? (
                <div className="space-y-3">
                  {recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{getCourseName(grade.courseId)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {grade.totalScore !== undefined && (
                            <span className="text-sm text-muted-foreground">
                              Toplam: <strong>{roundUpToInteger(grade.totalScore)}</strong>
                            </span>
                          )}
                          {grade.letterGrade && (
                            <Badge variant="default" className="text-xs">
                              {grade.letterGrade}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <IconFileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Henüz not eklenmemiş
                  </p>
                  <Link href="/grades">
                    <Button variant="outline" size="sm" className="mt-2">
                      İlk Notunuzu Ekleyin
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

