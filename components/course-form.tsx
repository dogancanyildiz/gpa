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
import { courseFormSchema, type CourseFormData, type Course } from "@/types/course"
import { useMemo } from "react"

interface CourseFormProps {
  course?: Course
  onSubmit: (data: CourseFormData) => void
  onCancel?: () => void
}

// Generate semester options (from 2020 to current year + 3 years)
function generateSemesterOptions(): string[] {
  const currentYear = new Date().getFullYear()
  const startYear = 2020
  const endYear = currentYear + 3
  const options: string[] = []
  
  // Generate from 2020 Güz to endYear Bahar
  for (let year = startYear; year <= endYear; year++) {
    options.push(`${year}-${year + 1} Güz`)
    options.push(`${year}-${year + 1} Bahar`)
  }
  
  return options
}

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const semesterOptions = useMemo(() => generateSemesterOptions(), [])
  
  // Get default semester (current semester)
  const getDefaultSemester = () => {
    if (course?.semester) return course.semester
    const currentYear = new Date().getFullYear()
    const month = new Date().getMonth() + 1 // 1-12
    // Güz: Eylül (9), Ekim (10), Kasım (11), Aralık (12), Ocak (1)
    // Bahar: Şubat (2), Mart (3), Nisan (4), Mayıs (5), Haziran (6), Temmuz (7), Ağustos (8)
    const semester = month >= 9 || month <= 1 ? "Güz" : "Bahar"
    const year = month >= 9 ? currentYear : currentYear - 1
    return `${year}-${year + 1} ${semester}`
  }

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: course?.name || "",
      code: course?.code || "",
      credit: course?.credit || 3,
      semester: course?.semester || getDefaultSemester(),
    },
  })

  const handleSubmit = async (data: CourseFormData) => {
    try {
      await Promise.resolve(onSubmit(data))
      form.reset()
    } catch {
      // Error handling is done in parent component
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ders Adı *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Örn: Veri Yapıları ve Algoritmalar"
                  {...field}
                  onBlur={(e) => {
                    field.onBlur()
                    field.onChange(e.target.value.trim())
                  }}
                />
              </FormControl>
              <FormDescription>
                Dersin tam adını girin (1-100 karakter)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ders Kodu</FormLabel>
              <FormControl>
                <Input
                  placeholder="Örn: CSE201"
                  {...field}
                  value={field.value || ""}
                  onBlur={(e) => {
                    field.onBlur()
                    const trimmed = e.target.value.trim()
                    field.onChange(trimmed.length > 0 ? trimmed : undefined)
                  }}
                />
              </FormControl>
              <FormDescription>
                Ders kodunu girin (opsiyonel, max 20 karakter)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="credit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AKTS</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="AKTS seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((credit) => (
                    <SelectItem key={credit} value={credit.toString()}>
                      {credit} AKTS
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Dersin AKTS (Avrupa Kredi Transfer Sistemi) değeri
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dönem *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={form.formState.isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Dönem seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {semesterOptions.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Dersin hangi döneme ait olduğunu seçin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
            loadingText={course ? "Güncelleniyor..." : "Ekleniyor..."}
          >
            {course ? "Güncelle" : "Ekle"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  )
}

