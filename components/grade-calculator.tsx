"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { roundUpToInteger } from "@/lib/utils"

interface GradeInfo {
  letter: string
  coefficient: number
  min: number
  max: number
}

const GRADE_SCALE: GradeInfo[] = [
  { letter: "AA", coefficient: 4.0, min: 90, max: 100 },
  { letter: "BA", coefficient: 3.5, min: 85, max: 89 },
  { letter: "BB", coefficient: 3.0, min: 75, max: 84 },
  { letter: "CB", coefficient: 2.5, min: 70, max: 74 },
  { letter: "CC", coefficient: 2.0, min: 60, max: 69 },
  { letter: "DC", coefficient: 1.5, min: 55, max: 59 },
  { letter: "DD", coefficient: 1.0, min: 50, max: 54 },
  { letter: "FD", coefficient: 0.5, min: 40, max: 49 },
  { letter: "FF", coefficient: 0.0, min: 0, max: 39 },
]

function getGradeLetter(score: number): GradeInfo | null {
  // Negatif değerler için en düşük notu döndür
  if (score < 0) {
    return GRADE_SCALE[GRADE_SCALE.length - 1] // FF
  }
  
  // 100'den büyük değerler için en yüksek notu döndür
  if (score > 100) {
    return GRADE_SCALE[0] // AA
  }
  
  // Normal aralık kontrolü
  // Her aralık için: score >= min && score <= max
  for (const grade of GRADE_SCALE) {
    if (score >= grade.min && score <= grade.max) {
      return grade
    }
  }
  
  // Eğer hiçbir aralığa uymuyorsa (olması gerekmez ama güvenlik için)
  // En düşük notu döndür
  return GRADE_SCALE[GRADE_SCALE.length - 1] // FF
}

function calculateFinalNeeded(
  midterm: number,
  quiz: number,
  targetGrade: GradeInfo
): number | null {
  // Ortalama = (vize * 0.375) + (kısa sınav * 0.125)
  const average = midterm * 0.375 + quiz * 0.125
  
  // Yuvarlanmış toplam not = Math.ceil(average + final * 0.5) >= targetGrade.min olmalı
  // En küçük final için: Math.ceil(average + final * 0.5) = targetGrade.min
  // Math.ceil(x) = n ise, x > n-1 ve x <= n
  // Yani: average + final * 0.5 > targetGrade.min - 1
  // final > (targetGrade.min - 1 - average) / 0.5
  // En küçük final için: final = ceil((targetGrade.min - 1 - average) / 0.5) + epsilon
  // Ama daha doğru: Math.ceil(average + final * 0.5) = targetGrade.min olacak şekilde final bul
  
  // Binary search veya doğrudan test ile en küçük final değerini bul
  // Math.ceil(average + final * 0.5) >= targetGrade.min olacak en küçük final
  // average + final * 0.5 > targetGrade.min - 1
  // final > (targetGrade.min - 1 - average) / 0.5
  
  const minFinalRaw = (targetGrade.min - 1 - average) / 0.5
  
  // Eğer minFinalRaw negatifse, final 0 yeterli olabilir
  if (minFinalRaw < 0) {
    // Final 0 ile test et
    const totalWithZero = average + 0 * 0.5
    const roundedWithZero = Math.ceil(totalWithZero)
    if (roundedWithZero >= targetGrade.min && roundedWithZero <= targetGrade.max) {
      return 0
    }
  }
  
  // En küçük final değerini bulmak için test et
  // Math.ceil(average + final * 0.5) = targetGrade.min olacak en küçük final
  for (let final = Math.max(0, Math.ceil(minFinalRaw)); final <= 100; final++) {
    const totalScore = average + final * 0.5
    const roundedScore = Math.ceil(totalScore)
    if (roundedScore >= targetGrade.min && roundedScore <= targetGrade.max) {
      return final
    }
    // Eğer yuvarlanmış not hedef notun üzerindeyse, daha küçük final bulunamaz
    if (roundedScore > targetGrade.max) {
      break
    }
  }
  
  return null
}

export function GradeCalculator() {
  const [midterm, setMidterm] = useState<string>("")
  const [quiz, setQuiz] = useState<string>("")
  const [final, setFinal] = useState<string>("")

  const midtermNum = parseFloat(midterm) || 0
  const quizNum = parseFloat(quiz) || 0
  const finalNum = parseFloat(final) || 0

  // Ortalama hesaplama (vize 37.5%, kısa sınav 12.5%)
  const average = midtermNum * 0.375 + quizNum * 0.125
  // Yuvarlanmış ortalama (sadece gösterim için)
  const roundedAverage = Math.ceil(average)

  // Final girildiyse toplam not hesaplama (final !== undefined kontrolü ile 0 değerini de kabul eder)
  // Tam ortalama kullanılmalı (yuvarlama sadece gösterim için yapılır, hesaplamalar için değil)
  const hasFinal = final !== "" && !isNaN(finalNum)
  const totalScore = hasFinal 
    ? average + finalNum * 0.5 
    : null

  // Harf notu hesaplama - yuvarlanmış değer üzerinden yapılır
  // Böylece gösterilen not ile harf notu eşleşir (örn: 89.375 → 90 → AA)
  const roundedScore = totalScore !== null ? Math.ceil(totalScore) : null
  const currentGrade = roundedScore !== null ? getGradeLetter(roundedScore) : null

  // Final girilmediyse, her harf notu için gerekli final notunu hesapla
  const finalNeededForGrades = !hasFinal && midtermNum > 0 && quizNum > 0
    ? GRADE_SCALE.map(grade => ({
        grade,
        finalNeeded: calculateFinalNeeded(midtermNum, quizNum, grade),
      }))
    : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Not Hesaplayıcı</CardTitle>
          <CardDescription>
            Vize ve kısa sınav notlarınızı girerek ortalamanızı hesaplayın ve 
            final notu ile hangi harf notunu alacağınızı görün.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="midterm">Vize Notu (37.5%)</Label>
              <Input
                id="midterm"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0-100 arası"
                value={midterm}
                onChange={(e) => setMidterm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz">Kısa Sınav Notu (12.5%)</Label>
              <Input
                id="quiz"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="0-100 arası"
                value={quiz}
                onChange={(e) => setQuiz(e.target.value)}
              />
            </div>
          </div>

          {(midtermNum > 0 || quizNum > 0) && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ara Sınav Ortalaması:</span>
                <span className="text-lg font-bold">
                  {roundedAverage} / 50
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                (Vize: {midtermNum} × 37.5% + Kısa Sınav: {quizNum} × 12.5% = {average.toFixed(2)} → {roundedAverage})
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="final">Final Notu (50%)</Label>
            <Input
              id="final"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="0-100 arası (isteğe bağlı)"
              value={final}
              onChange={(e) => setFinal(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Final notunu girerek toplam notunuzu ve harf notunuzu görebilirsiniz.
            </p>
          </div>

          {totalScore !== null && (
            <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Toplam Not:</span>
                <span className="text-2xl font-bold">{roundUpToInteger(totalScore)}</span>
              </div>
              {currentGrade ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Harf Notu:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {currentGrade.letter}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    (Katsayı: {currentGrade.coefficient.toFixed(2)})
                  </span>
                </div>
              </div>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground">
                  Harf notu hesaplanamadı
                </div>
              )}
            </div>
          )}

          {!hasFinal && midtermNum > 0 && quizNum > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Final Notuna Göre Alabileceğiniz Harf Notları:
              </h3>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {finalNeededForGrades.map(({ grade, finalNeeded }) => (
                  <div
                    key={grade.letter}
                    className="rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline">{grade.letter}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {grade.coefficient.toFixed(2)}
                      </span>
                    </div>
                    {finalNeeded !== null ? (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">
                          Final için:{" "}
                        </span>
                        <span className="font-semibold">
                          {finalNeeded >= 0 && finalNeeded <= 100
                            ? `${finalNeeded} ve üzeri`
                            : "Mümkün değil"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground mt-2 block">
                        Bu notu almak mümkün değil
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Harf Notu Sistemi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Puan Aralığı</th>
                  <th className="text-left p-2">Harf Notu</th>
                  <th className="text-left p-2">Katsayı</th>
                </tr>
              </thead>
              <tbody>
                {GRADE_SCALE.map((grade) => (
                  <tr key={grade.letter} className="border-b">
                    <td className="p-2">{grade.min}-{grade.max}</td>
                    <td className="p-2 font-semibold">{grade.letter}</td>
                    <td className="p-2">{grade.coefficient.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

