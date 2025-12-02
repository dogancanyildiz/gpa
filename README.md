# neuGPA - Not Hesaplama Sistemi

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
  - Prisma ORM
  - SQLite (Development) / PostgreSQL (Production)
  - NextAuth.js (Authentication)
  - bcryptjs (Password Hashing)

## 📁 Proje Yapısı

```
neuGPA/
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
│   ├── db.ts                # Prisma Client
│   └── utils.ts             # Utility fonksiyonlar
│
├── prisma/                   # Prisma dosyaları
│   ├── schema.prisma        # Veritabanı şeması
│   └── migrations/          # Veritabanı migration'ları
│
├── types/                    # TypeScript tip tanımları
│   └── next-auth.d.ts       # NextAuth tip genişletmeleri
│
├── hooks/                    # Custom React hooks
│
├── public/                   # Statik dosyalar
│
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
   cd neuGPA
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
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Veritabanını oluşturun:**
   ```bash
   pnpm db:migrate
   ```

5. **Prisma Client'ı generate edin:**
   ```bash
   pnpm db:generate
   ```

6. **Development server'ı başlatın:**
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

# Veritabanı
pnpm db:generate      # Prisma Client generate et
pnpm db:migrate       # Migration oluştur ve uygula
pnpm db:studio        # Prisma Studio'yu aç
pnpm db:push          # Schema'yı veritabanına push et
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
refactor(db): simplify Prisma client initialization
```

Daha fazla bilgi için [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasına bakın.

## 🚢 Deployment

### Vercel (Önerilen)

1. Projeyi GitHub'a push edin
2. [Vercel](https://vercel.com) hesabınıza giriş yapın
3. "New Project" butonuna tıklayın
4. Repository'nizi seçin
5. Environment variables'ları ekleyin:
   - `DATABASE_URL`
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
