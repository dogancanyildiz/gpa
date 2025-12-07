"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/loading-button"
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
import { roundUpToInteger } from "@/lib/utils"

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

  // React Hook Form's watch() returns current form values
  // These cannot be memoized safely, but it's safe to use them directly
  const midterm = form.watch("midterm")
  const quiz = form.watch("quiz")
  const final = form.watch("final")

  // Calculate grade in real-time
  const calculation = calculateGrade(midterm, quiz, final)

  const handleSubmit = async (data: GradeFormData) => {
    try {
      await Promise.resolve(
        onSubmit({
          courseId: data.courseId,
          midterm: data.midterm,
          quiz: data.quiz,
          final: data.final,
        })
      )
      form.reset()
    } catch {
      // Error handling is done in parent component
    }
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
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseFloat(e.target.value)
                        if (value !== undefined && (isNaN(value) || value < 0 || value > 100)) {
                          return
                        }
                        field.onChange(value)
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormDescription>
                    Vize notunuzu girin (0-100 arası)
                  </FormDescription>
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
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseFloat(e.target.value)
                        if (value !== undefined && (isNaN(value) || value < 0 || value > 100)) {
                          return
                        }
                        field.onChange(value)
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormDescription>
                    Kısa sınav notunuzu girin (0-100 arası)
                  </FormDescription>
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
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? undefined : parseFloat(e.target.value)
                        if (value !== undefined && (isNaN(value) || value < 0 || value > 100)) {
                          return
                        }
                        field.onChange(value)
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormDescription>
                    Final notunuzu girin (0-100 arası)
                  </FormDescription>
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
                      {calculation.roundedAverage} / 50
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Toplam Not</p>
                    <p className="text-2xl font-bold">
                      {roundUpToInteger(calculation.totalScore)}
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
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={form.formState.isSubmitting}
              >
                İptal
              </Button>
            )}
            <LoadingButton
              type="submit"
              loading={form.formState.isSubmitting}
              loadingText={grade ? "Güncelleniyor..." : "Ekleniyor..."}
            >
              {grade ? "Güncelle" : "Ekle"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  )
}

