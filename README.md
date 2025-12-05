# GPA - Not Hesaplama Sistemi

Modern ve kullanıcı dostu bir not hesaplama uygulaması. Kısa sınav, vize ve final notlarınızı hesaplayın, derslerinizi yönetin ve not ortalamalarınızı takip edin.

## 🚀 Özellikler

- ✅ Kısa sınav, vize ve final notu hesaplama
- ✅ Ders ve not yönetimi
- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ Modern ve responsive arayüz (shadcn/ui)
- ✅ Karanlık mod desteği

## 🛠️ Teknolojiler

- **Frontend:**
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - React Hook Form + Zod

- **Backend:**
  - Next.js API Routes
  - Supabase (Database & Authentication)
  - NextAuth.js (Authentication)

## 📁 Proje Yapısı

```
gpa/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   └── auth/             # NextAuth API routes
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Ana sayfa
│   └── globals.css           # Global stiller
│
├── components/               # React bileşenleri
│   └── ui/                   # shadcn/ui bileşenleri
│
├── lib/                      # Yardımcı fonksiyonlar
│   ├── auth.ts              # NextAuth yapılandırması
│   ├── supabase/            # Supabase client'ları
│   └── utils.ts             # Utility fonksiyonlar
│
├── types/                    # TypeScript tip tanımları
│   ├── next-auth.d.ts       # NextAuth tip genişletmeleri
│   └── supabase.ts          # Supabase tip tanımları
│
├── hooks/                    # Custom React hooks
│
├── .github/                  # GitHub yapılandırmaları
│   └── workflows/           # GitHub Actions workflow'ları
│
├── public/                   # Statik dosyalar
│
├── next.config.ts            # Next.js yapılandırma dosyası
├── tsconfig.json             # TypeScript yapılandırma dosyası
├── components.json           # shadcn/ui yapılandırma dosyası
└── .env                      # Ortam değişkenleri (git'e eklenmez)
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

3. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   ```
   
   `.env` dosyasını düzenleyin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Development server'ı başlatın:**
   ```bash
   pnpm dev
   ```

7. Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📜 Komutlar

```bash
# Development
pnpm dev              # Development server başlat
pnpm build            # Production build oluştur
pnpm start            # Production server başlat
pnpm lint             # ESLint çalıştır
```

## 🗄️ Veritabanı Şeması

### User (Kullanıcı)
- `id`: Benzersiz kullanıcı ID
- `email`: E-posta adresi (unique)
- `name`: Kullanıcı adı
- `password`: Hashlenmiş şifre
- `courses`: Kullanıcının dersleri

### Course (Ders)
- `id`: Benzersiz ders ID
- `name`: Ders adı
- `code`: Ders kodu (opsiyonel)
- `userId`: Ders sahibi kullanıcı ID
- `assessments`: Dersin değerlendirmeleri

### Assessment (Değerlendirme)
- `id`: Benzersiz değerlendirme ID
- `type`: Değerlendirme tipi (quiz, midterm, final)
- `name`: Değerlendirme adı
- `weight`: Ağırlık yüzdesi (örn: 10, 30, 40)
- `score`: Alınan not (opsiyonel)
- `maxScore`: Maksimum not (varsayılan: 100)
- `courseId`: Bağlı olduğu ders ID

## 🔐 Kimlik Doğrulama

Proje NextAuth.js kullanarak kimlik doğrulama sağlar. Şu anda Credentials Provider (email/şifre) kullanılmaktadır.

### API Routes

- `POST /api/auth/register` - Kullanıcı kaydı (henüz oluşturulmadı)
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoint'leri

## 🎨 UI Bileşenleri

Proje [shadcn/ui](https://ui.shadcn.com) bileşenlerini kullanır. Tüm bileşenler `components/ui/` klasöründe bulunur.

## 📝 Commit Kuralları

Bu proje [Conventional Commits](https://www.conventionalcommits.org/) standardını kullanır.

Format: `<type>(<scope>): <subject>`

### Commit Tipleri

- `feat`: Yeni özellik
- `fix`: Hata düzeltmesi
- `docs`: Dokümantasyon değişiklikleri
- `style`: Kod formatı (formatting, missing semi colons, etc)
- `refactor`: Kod refaktörü
- `perf`: Performans iyileştirmesi
- `test`: Test ekleme veya düzeltme
- `chore`: Build process veya yardımcı araçlar

### Örnekler

```bash
feat(auth): add user registration endpoint
fix(ui): correct button color in dark mode
docs(readme): update installation instructions
refactor(supabase): update database client configuration
```

Daha fazla bilgi için [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasına bakın.

## 🔄 CI/CD

Proje GitHub Actions ile CI/CD pipeline'ı kullanır.

### Workflow'lar

- **CI Pipeline** (`ci.yml`): Her push ve pull request'te çalışır
  - ESLint kontrolü
  - TypeScript type checking
  - Production build testi

- **CodeQL Analysis** (`codeql.yml`): Güvenlik analizi
  - JavaScript/TypeScript kod analizi
  - Güvenlik açıklarını tespit eder

### Çalıştığı Branch'ler

Workflow'lar şu branch'lerde çalışır:
- `main` - Production branch
- `develop` - Development branch
- `feat/**` - Feature branch'leri
- `release/**` - Release branch'leri
- `hotfix/**` - Hotfix branch'leri
- `t&q` - Test & QA branch'i

### Workflow Durumu

GitHub Actions badge'ini README'ye ekleyebilirsiniz:

```markdown
![CI](https://github.com/username/gpa/workflows/CI/badge.svg)
```

## 🚢 Deployment

### Vercel (Önerilen)

1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com) hesabınıza giriş yapın
3. "New Project" butonuna tıklayın
4. Repository'nizi seçin
5. Environment variables'ları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
6. Deploy edin!

### Diğer Platformlar

Next.js uygulaması herhangi bir Node.js hosting platformunda çalışabilir.

## 📄 Lisans

Bu proje özel bir projedir.

## 👥 Katkıda Bulunma

Katkıda bulunmak için [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasını okuyun.

## 📞 İletişim

Sorularınız için issue açabilirsiniz.
