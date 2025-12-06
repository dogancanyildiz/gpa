"use client"

import { IconTrendingUp, IconChartBar, IconChartDonut, IconBook } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStatistics } from "@/hooks/use-statistics"
import { GradeDistributionChart } from "@/components/grade-distribution-chart"
import { CoursePerformanceChart } from "@/components/course-performance-chart"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"

export function StatisticsOverview() {
  const { statistics, gradeDistributionData, coursePerformanceData } = useStatistics()
  const { isLoading: coursesLoading } = useCourses()
  const { isLoading: gradesLoading } = useGrades()
  
  const isLoading = coursesLoading || gradesLoading

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600 dark:text-green-400"
    if (gpa >= 3.0) return "text-blue-600 dark:text-blue-400"
    if (gpa >= 2.5) return "text-yellow-600 dark:text-yellow-400"
    if (gpa >= 2.0) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">İstatistikler</h1>
        <p className="text-muted-foreground">
          Akademik performansınızı görüntüleyin ve analiz edin
        </p>
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
                    {statistics.totalGPA.toFixed(2)}
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

      {/* Charts */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
        {/* Grade Distribution Pie Chart */}
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

        {/* Course Performance Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ders Performansı</CardTitle>
            <CardDescription>
              Derslerinizin GPA değerleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            {coursePerformanceData.length > 0 ? (
              <CoursePerformanceChart data={coursePerformanceData} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <IconChartBar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Henüz not girilmemiş
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      )}

      {/* Course Details Table */}
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : statistics.courseStats.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Ders Detayları</CardTitle>
            <CardDescription>
              Tüm derslerinizin detaylı bilgileri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.courseStats.map((stat) => (
                <div
                  key={stat.course.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{stat.course.name}</h3>
                      {stat.course.code && (
                        <Badge variant="outline">{stat.course.code}</Badge>
                      )}
                      <Badge variant="secondary">{stat.credits} AKTS</Badge>
                    </div>
                    {stat.grade && (
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Toplam: <strong>{stat.grade.totalScore?.toFixed(2)}</strong>
                        </span>
                        <span>
                          Harf: <strong>{stat.grade.letterGrade}</strong>
                        </span>
                        <span>
                          GPA: <strong>{stat.gpa.toFixed(2)}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {stat.grade ? (
                      <Badge variant={stat.gpa >= 3.0 ? "default" : stat.gpa >= 2.0 ? "secondary" : "destructive"}>
                        {stat.gpa.toFixed(2)}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not girilmemiş</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

