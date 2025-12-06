"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { gradeFormSchema, type GradeFormData, type Grade, calculateGrade } from "@/types/grade"
import type { Course } from "@/types/course"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GradeFormProps {
  grade?: Grade
  courses: Course[]
  onSubmit: (data: { courseId: string; midterm?: number; quiz?: number; final?: number }) => void
  onCancel?: () => void
}

export function GradeForm({ grade, courses, onSubmit, onCancel }: GradeFormProps) {
  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      courseId: grade?.courseId || "",
      midterm: grade?.midterm,
      quiz: grade?.quiz,
      final: grade?.final,
    },
  })

  // React Hook Form's watch() cannot be memoized safely, but it's safe to use here
  // eslint-disable-next-line react-hooks/incompatible-library
  const midterm = form.watch("midterm") || 0
   
  const quiz = form.watch("quiz") || 0
   
  const final = form.watch("final") || 0

  // Calculate grade in real-time
  const calculation = calculateGrade(midterm, quiz, final)

  const handleSubmit = (data: GradeFormData) => {
    onSubmit({
      courseId: data.courseId,
      midterm: data.midterm,
      quiz: data.quiz,
      final: data.final,
    })
    form.reset()
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ders *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!grade}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Ders seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} {course.code && `(${course.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Not eklemek istediğiniz dersi seçin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="midterm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vize Notu (37.5%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseFloat(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quiz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kısa Sınav (12.5%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseFloat(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="final"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final (50%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0-100"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseFloat(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Real-time calculation preview */}
          {calculation.totalScore !== null && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Hesaplama Önizlemesi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ara Sınav Ortalaması</p>
                    <p className="text-lg font-semibold">
                      {(midterm * 0.375 + quiz * 0.125).toFixed(2)} / 50
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Toplam Not</p>
                    <p className="text-2xl font-bold">
                      {calculation.totalScore.toFixed(2)}
                    </p>
                  </div>
                  {calculation.letterGrade && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Harf Notu</p>
                      <Badge variant="default" className="text-lg px-3 py-1">
                        {calculation.letterGrade}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                İptal
              </Button>
            )}
            <Button type="submit">
              {grade ? "Güncelle" : "Ekle"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

