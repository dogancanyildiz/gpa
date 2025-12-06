# GPA - Not Hesaplama Sistemi

Modern ve kullanıcı dostu bir not hesaplama uygulaması. Kısa sınav, vize ve final notlarınızı hesaplayın, derslerinizi yönetin ve not ortalamalarınızı takip edin.

## 🚀 Özellikler

### Temel Özellikler
- ✅ **Not Hesaplama**: Kısa sınav (12.5%), vize (37.5%) ve final (50%) notu hesaplama
- ✅ **Ders Yönetimi**: Ders ekleme, düzenleme ve silme
- ✅ **Not Yönetimi**: Her ders için not girişi ve takibi
- ✅ **Dönem Sistemi**: Dersleri dönemlere göre kategorize etme
- ✅ **GPA Hesaplama**: AKTS ağırlıklı genel not ortalaması hesaplama

### Gelişmiş Özellikler
- ✅ **İstatistikler**: Detaylı istatistikler ve görselleştirmeler
  - Genel GPA ve toplam AKTS
  - Harf notu dağılımı (Pie Chart)
  - Ders performans grafikleri (Bar Chart)
  - Tamamlanma oranı
- ✅ **Raporlar**: Transkript görüntüleme ve yazdırma
- ✅ **Arama ve Filtreleme**: Ders ve notlarda gelişmiş arama
- ✅ **Sayfalama**: Büyük veri setleri için pagination desteği
- ✅ **Offline Desteği**: Service Worker ile offline çalışma
- ✅ **Hata Yönetimi**: Error Boundary ile global hata yakalama
- ✅ **Loading States**: Skeleton ve spinner ile yükleme durumları
- ✅ **Form Validasyonu**: Client-side ve server-side validasyon (Zod)
- ✅ **Welcome Dialog**: İlk kullanım için bilgilendirme

### Kullanıcı Deneyimi
- ✅ Modern ve responsive arayüz (shadcn/ui)
- ✅ Karanlık mod desteği
- ✅ Toast bildirimleri
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Erişilebilirlik desteği

## 🛠️ Teknolojiler

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Form Management**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Tabler Icons
- **Notifications**: Sonner (Toast)

### Veri Yönetimi
- **Storage**: LocalStorage (client-side)
- **State Management**: React Hooks (useState, useMemo, useEffect)
- **Data Validation**: Zod schemas

### Test & Quality
- **Testing**: Vitest
- **Test Library**: React Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript

### Deployment
- **Hosting**: GitHub Pages (Static Export)
- **CI/CD**: GitHub Actions
- **Build**: Next.js Static Export

## 📁 Proje Yapısı

```text
gpa/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (disabled for static export)
│   │   └── auth/                 # NextAuth API routes
│   ├── courses/                  # Dersler sayfası
│   │   └── page.tsx
│   ├── dashboard/                # Ana sayfa (Dashboard)
│   │   └── page.tsx
│   ├── grades/                   # Notlar sayfası
│   │   └── page.tsx
│   ├── statistics/                # İstatistikler sayfası
│   │   └── page.tsx
│   ├── reports/                   # Raporlar sayfası
│   │   └── page.tsx
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Ana sayfa (redirect)
│   └── globals.css                # Global stiller
│
├── components/                    # React bileşenleri
│   ├── ui/                        # shadcn/ui bileşenleri
│   ├── app-sidebar.tsx            # Ana sidebar
│   ├── course-form.tsx            # Ders formu
│   ├── courses-list.tsx           # Ders listesi
│   ├── grade-calculator.tsx       # Not hesaplayıcı
│   ├── grade-form.tsx             # Not formu
│   ├── grades-list.tsx            # Not listesi
│   ├── dashboard-overview.tsx    # Dashboard özeti
│   ├── statistics-overview.tsx    # İstatistikler özeti
│   ├── reports-overview.tsx       # Raporlar özeti
│   ├── error-boundary.tsx         # Error boundary
│   ├── welcome-dialog.tsx         # Hoş geldiniz dialogu
│   └── ...
│
├── hooks/                         # Custom React hooks
│   ├── use-courses.ts             # Ders yönetimi hook'u
│   ├── use-grades.ts              # Not yönetimi hook'u
│   ├── use-statistics.ts          # İstatistik hesaplama hook'u
│   └── use-pagination.ts          # Sayfalama hook'u
│
├── lib/                           # Yardımcı fonksiyonlar
│   ├── __tests__/                 # Test dosyaları
│   │   └── validation.test.ts
│   ├── error-handler.ts           # Hata yönetimi
│   ├── validation.ts              # Validasyon fonksiyonları
│   ├── offline.ts                 # Offline desteği
│   ├── supabase/                  # Supabase client'ları (gelecek için)
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts                   # Utility fonksiyonlar
│
├── types/                         # TypeScript tip tanımları
│   ├── course.ts                  # Ders tipleri ve şemaları
│   ├── grade.ts                   # Not tipleri ve şemaları
│   └── next-auth.d.ts             # NextAuth tip genişletmeleri
│
├── public/                        # Statik dosyalar
│   └── sw.js                      # Service Worker
│
├── .github/                       # GitHub yapılandırmaları
│   └── workflows/                 # GitHub Actions workflow'ları
│       └── nextjs.yml             # GitHub Pages deployment
│
├── next.config.ts                 # Next.js yapılandırma dosyası
├── tsconfig.json                  # TypeScript yapılandırma dosyası
├── vitest.config.ts               # Vitest yapılandırma dosyası
├── eslint.config.mjs              # ESLint yapılandırma dosyası
├── components.json                # shadcn/ui yapılandırma dosyası
└── package.json                   # Proje bağımlılıkları
```

## 🚦 Başlangıç

### Gereksinimler

- Node.js 20+
- pnpm (önerilen) veya npm/yarn

### Kurulum

1. **Projeyi klonlayın:**

   ```bash
   git clone <repository-url>
   cd gpa
   ```

2. **Bağımlılıkları yükleyin:**

   ```bash
   pnpm install
   ```

3. **Development server'ı başlatın:**

   ```bash
   pnpm dev
   ```

4. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

### Not Hesaplama Formülü

Uygulama şu formülü kullanarak not hesaplar:

```
Ara Sınav Ortalaması = (Vize × 0.375) + (Kısa Sınav × 0.125)
Toplam Not = Ara Sınav Ortalaması + (Final × 0.5)
```

**Harf Notu Sistemi:**
- AA: 90-100 (Katsayı: 4.0)
- BA: 85-89 (Katsayı: 3.5)
- BB: 75-84 (Katsayı: 3.0)
- CB: 70-74 (Katsayı: 2.5)
- CC: 60-69 (Katsayı: 2.0)
- DC: 55-59 (Katsayı: 1.5)
- DD: 50-54 (Katsayı: 1.0)
- FD: 40-49 (Katsayı: 0.5)
- FF: 0-39 (Katsayı: 0.0)

**GPA Hesaplama:**
```
GPA = Σ(Ders Katsayısı × Ders AKTS) / Σ(Ders AKTS)
```

## 📜 Komutlar

```bash
# Development
pnpm dev              # Development server başlat
pnpm build            # Production build oluştur
pnpm start            # Production server başlat

# Code Quality
pnpm lint             # ESLint çalıştır
pnpm exec tsc --noEmit # TypeScript type checking

# Testing
pnpm test            # Vitest testleri çalıştır
pnpm test:ui         # Vitest UI ile testleri çalıştır
pnpm test:coverage   # Test coverage raporu oluştur
```

## 💾 Veri Yönetimi

### LocalStorage

Uygulama şu anda **LocalStorage** kullanarak verileri tarayıcıda saklar. Bu sayede:

- ✅ Giriş yapmadan kullanım
- ✅ Hızlı ve offline çalışma
- ✅ Veri gizliliği (veriler sadece tarayıcınızda)

**Önemli Notlar:**
- Veriler sadece kullandığınız tarayıcıda saklanır
- Tarayıcı verilerini temizlerseniz verileriniz kaybolur
- Farklı cihazlardan erişim için backend entegrasyonu planlanmaktadır

### Veri Yapısı

#### Course (Ders)
```typescript
{
  id: string (UUID)
  name: string (1-100 karakter)
  code?: string (max 20 karakter, opsiyonel)
  credit: number (0-10, AKTS değeri)
  semester: string (1-50 karakter, örn: "2024-2025 Güz")
  createdAt: string (ISO datetime)
  updatedAt?: string (ISO datetime, opsiyonel)
}
```

#### Grade (Not)
```typescript
{
  id: string (UUID)
  courseId: string (UUID, ders referansı)
  midterm?: number (0-100, vize notu)
  quiz?: number (0-100, kısa sınav notu)
  final?: number (0-100, final notu)
  totalScore?: number (0-100, hesaplanan toplam not)
  letterGrade?: string (AA, BA, BB, vb.)
  createdAt: string (ISO datetime)
  updatedAt?: string (ISO datetime, opsiyonel)
}
```

## 🚢 Deployment

### GitHub Pages

Uygulama GitHub Pages'e otomatik olarak deploy edilir:

1. **Otomatik Deployment**: `main` branch'ine push yapıldığında otomatik deploy
2. **Static Export**: Next.js static export kullanılır
3. **Base Path**: `/gpa` (repo adı)

**Deployment URL**: `https://<username>.github.io/gpa`

### Manuel Deployment

```bash
# Build için environment variable ayarla
export GITHUB_PAGES=true

# Build oluştur
pnpm build

# out/ klasörü static dosyaları içerir
```

### Diğer Platformlar

Next.js uygulaması herhangi bir static hosting platformunda çalışabilir:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

## 🔄 CI/CD

Proje GitHub Actions ile CI/CD pipeline'ı kullanır.

### Workflow'lar

- **Deploy to GitHub Pages** (`nextjs.yml`): 
  - `main` branch'ine push yapıldığında çalışır
  - Next.js build ve static export
  - GitHub Pages'e otomatik deploy

### CI Pipeline Kontrolleri

CI pipeline şu kontrolleri yapar:
- ESLint ile kod kalitesi kontrolü
- TypeScript type checking
- Production build testi

## 🧪 Test

Proje Vitest kullanarak test yazımını destekler:

```bash
# Tüm testleri çalıştır
pnpm test

# UI ile testleri çalıştır
pnpm test:ui

# Coverage raporu
pnpm test:coverage
```

Test dosyaları `lib/__tests__/` klasöründe bulunur.

## 🎨 UI Bileşenleri

Proje [shadcn/ui](https://ui.shadcn.com) bileşenlerini kullanır. Tüm bileşenler `components/ui/` klasöründe bulunur.

### Özel Bileşenler

- `ErrorBoundary`: Global hata yakalama
- `WelcomeDialog`: İlk kullanım bilgilendirmesi
- `LoadingButton`: Yükleme durumlu buton
- `SkeletonCard`: Kart skeleton loader
- `SkeletonTable`: Tablo skeleton loader

## 📝 Commit Kuralları

Bu proje [Conventional Commits](https://www.conventionalcommits.org/) standardını kullanır.

Format: `<type>(<scope>): <subject>`

### Commit Tipleri

- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon değişiklikleri
- `style`: Kod formatı
- `refactor`: Kod refaktörü
- `perf`: Performans iyileştirmesi
- `test`: Test ekleme veya düzeltme
- `chore`: Build process veya yardımcı araçlar

Daha fazla bilgi için [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasına bakın.

## 🔮 Gelecek Özellikler

- [ ] Backend entegrasyonu (Supabase)
- [ ] Kullanıcı kayıt ve giriş sistemi
- [ ] Veri senkronizasyonu (cloud)
- [ ] Çoklu cihaz desteği
- [ ] Veri export/import (JSON)
- [ ] Bildirimler (not hatırlatıcıları)
- [ ] Ders programı takibi
- [ ] Akademik takvim

## 📄 Lisans

Bu proje [MIT Lisansı](./LICENSE.md) altında lisanslanmıştır.

## 👥 Katkıda Bulunma

Katkıda bulunmak için [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasını okuyun.

## 👤 Geliştirici

**Doğan Can YILDIZ**

- LinkedIn: [@dogancanyildiz](https://www.linkedin.com/in/dogancanyildiz)

## 📞 İletişim

Sorularınız için issue açabilirsiniz.

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Chart library
- [Tabler Icons](https://tabler.io/icons) - Icon library
