"use client"

import { IconPrinter } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCourses } from "@/hooks/use-courses"
import { useGrades } from "@/hooks/use-grades"
import { useStatistics } from "@/hooks/use-statistics"
import { TranscriptView } from "@/components/transcript-view"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonTable } from "@/components/skeleton-table"

export function ReportsOverview() {
  const { courses, isLoading: coursesLoading } = useCourses()
  const { grades, isLoading: gradesLoading } = useGrades()
  const { statistics } = useStatistics()
  
  const isLoading = coursesLoading || gradesLoading

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
          <p className="text-muted-foreground">
            Transkript görüntüleyin ve yazdırın
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <Button variant="outline" onClick={handlePrint}>
            <IconPrinter className="mr-2 h-4 w-4" />
            Yazdır
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Özet Bilgiler</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Genel GPA</p>
                <p className="text-2xl font-bold">
                  {statistics.totalGPA > 0 ? statistics.totalGPA.toFixed(2) : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam AKTS</p>
                <p className="text-2xl font-bold">{statistics.totalCredits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tamamlanan AKTS</p>
                <p className="text-2xl font-bold">{statistics.completedCredits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ders Sayısı</p>
                <p className="text-2xl font-bold">{statistics.courseCount}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcript View */}
      <Card className="print:shadow-none">
        <CardHeader>
          <CardTitle>Akademik Transkript</CardTitle>
          <CardDescription>
            Tüm derslerinizin detaylı listesi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable rows={5} columns={9} />
          ) : (
            <TranscriptView courses={courses} grades={grades} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

