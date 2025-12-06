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
import { courseFormSchema, type CourseFormData, type Course } from "@/types/course"

interface CourseFormProps {
  course?: Course
  onSubmit: (data: CourseFormData) => void
  onCancel?: () => void
}

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: course?.name || "",
      code: course?.code || "",
      credit: course?.credit || 3,
    },
  })

  const handleSubmit = (data: CourseFormData) => {
    onSubmit(data)
    form.reset()
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
                <Input placeholder="Örn: Veri Yapıları ve Algoritmalar" {...field} />
              </FormControl>
              <FormDescription>
                Dersin tam adını girin
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
                <Input placeholder="Örn: CSE201" {...field} />
              </FormControl>
              <FormDescription>
                Ders kodunu girin (opsiyonel)
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

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
          )}
          <Button type="submit">
            {course ? "Güncelle" : "Ekle"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

