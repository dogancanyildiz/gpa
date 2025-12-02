# Katkıda Bulunma Rehberi

GPA projesine katkıda bulunmak istediğiniz için teşekkürler! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 📋 İçindekiler

- [Commit Kuralları](#commit-kuralları)
- [Branch Stratejisi](#branch-stratejisi)
- [Kod Standartları](#kod-standartları)
- [CI/CD Süreci](#cicd-süreci)
- [Pull Request Süreci](#pull-request-süreci)

## 🔄 Commit Kuralları

Bu proje [Conventional Commits](https://www.conventionalcommits.org/) standardını kullanır.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Tipleri

| Tip | Açıklama |
|-----|----------|
| `feat` | Yeni özellik eklendi |
| `fix` | Hata düzeltmesi |
| `docs` | Sadece dokümantasyon değişiklikleri |
| `style` | Kod formatı, noktalı virgül eksikliği vb. (kod mantığını etkilemez) |
| `refactor` | Hata düzeltmesi veya özellik ekleme olmayan kod değişikliği |
| `perf` | Performans iyileştirmesi |
| `test` | Test ekleme veya mevcut testleri düzeltme |
| `chore` | Build process veya yardımcı araçlar ve kütüphaneler (ör. güncellemeler) |
| `ci` | CI yapılandırma dosyaları ve scriptler |
| `build` | Build sistemini veya dış bağımlılıkları etkileyen değişiklikler |

### Scope (Kapsam)

Scope, commit'in hangi bölümü etkilediğini belirtir. Örnekler:

- `auth` - Kimlik doğrulama
- `ui` - Kullanıcı arayüzü
- `api` - API routes
- `db` - Veritabanı
- `config` - Yapılandırma
- `deps` - Bağımlılıklar

### Subject (Konu)

- İlk harf küçük olmalı
- Nokta ile bitmemeli
- Emir kipi kullanılmalı ("add" değil "added", "fix" değil "fixed")

### Örnekler

```bash
# Yeni özellik
feat(auth): add user registration endpoint
feat(ui): implement grade calculator component

# Hata düzeltmesi
fix(api): resolve authentication token expiration
fix(db): correct user email validation

# Dokümantasyon
docs(readme): update installation instructions
docs(api): add endpoint documentation

# Refaktör
refactor(db): simplify Prisma client initialization
refactor(ui): extract reusable form components

# Stil
style(ui): format code with prettier
style(auth): fix linting errors

# Performans
perf(api): optimize database queries
perf(ui): lazy load heavy components

# Test
test(auth): add login endpoint tests
test(ui): add component unit tests

# Chore
chore(deps): update Next.js to 16.0.6
chore(config): add ESLint configuration
```

### Body (Gövde) - Opsiyonel

Body, commit'in neden yapıldığını ve önceki davranıştan nasıl farklı olduğunu açıklar.

```bash
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Users can now request password reset via email link.

Closes #123
```

### Footer (Alt Bilgi) - Opsiyonel

Footer, breaking changes veya issue referansları için kullanılır.

```bash
feat(api): change authentication endpoint structure

BREAKING CHANGE: Authentication endpoint moved from /auth/login to /api/auth/signin
```

## 🌿 Branch Stratejisi

### Branch İsimlendirme

```
<type>/<scope>-<description>
```

Örnekler:
- `feat/auth-user-registration`
- `fix/ui-button-styling`
- `refactor/db-prisma-client`

### Branch Tipleri ve Kullanımı

| Branch Tipi | Açıklama | CI/CD | Kullanım |
|------------|----------|-------|----------|
| `main` | Production-ready kod | ✅ Push & PR | Sadece release'ler için |
| `develop` | Development branch | ✅ Push & PR | Ana development branch |
| `feat/**` | Yeni özellikler | ✅ Push | Feature geliştirme |
| `fix/**` | Hata düzeltmeleri | ✅ Push | Bug fix'ler |
| `refactor/**` | Kod refaktörü | ✅ Push | Kod iyileştirmeleri |
| `release/**` | Release hazırlığı | ✅ Push & PR | Yeni versiyon hazırlığı |
| `hotfix/**` | Acil düzeltmeler | ✅ Push | Production bug fix'ler |
| `t&q` | Test & QA | ✅ Push & PR | Test ve kalite kontrol |

**Not:** Tüm branch'lerde push yapıldığında CI otomatik çalışır. Pull Request'ler sadece `main`, `develop`, `release/**` ve `t&q` branch'lerine açılabilir.

## 💻 Kod Standartları

### TypeScript

- Tüm dosyalar TypeScript kullanmalı
- `any` tipinden kaçınılmalı
- Interface'ler tercih edilmeli (type değil)

### Stil

- ESLint kurallarına uyulmalı
- Prettier formatı kullanılmalı
- 2 space indentation

### Dosya İsimlendirme

- React bileşenleri: `PascalCase.tsx`
- Utility fonksiyonlar: `camelCase.ts`
- API routes: `route.ts`
- Types: `kebab-case.d.ts`

### Import Sırası

1. External dependencies
2. Internal modules (@/ imports)
3. Relative imports
4. Types

```typescript
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import type { User } from '@/types'
```

## 🔄 CI/CD Süreci

Proje GitHub Actions ile otomatik CI/CD pipeline'ı kullanır. Her push ve pull request'te otomatik olarak çalışır.

### CI Pipeline Kontrolleri

CI pipeline şu kontrolleri yapar:

1. **Lint & Type Check**
   - ESLint ile kod kalitesi kontrolü
   - TypeScript type checking
   - Kod standartlarına uyum kontrolü

2. **Build Test**
   - Production build testi
   - Prisma Client generate kontrolü
   - Build hatalarının tespiti

3. **Database Migration Check**
   - Prisma schema validation
   - Migration status kontrolü
   - Veritabanı yapısı doğrulama

### CI Çalıştığı Branch'ler

CI pipeline otomatik olarak çalışır. Detaylı branch stratejisi için [Branch Stratejisi](#-branch-stratejisi) bölümüne bakın.

**Özet:**
- **Push:** Tüm branch tiplerinde (`main`, `develop`, `feat/**`, `fix/**`, `refactor/**`, `release/**`, `hotfix/**`, `t&q`)
- **Pull Request:** Sadece `main`, `develop`, `release/**` ve `t&q` branch'lerine açılan PR'larda

### CI Başarısız Olursa

Eğer CI pipeline başarısız olursa:

1. **GitHub Actions sekmesine gidin**
   - Repository'de "Actions" sekmesine tıklayın
   - Başarısız workflow'u bulun

2. **Hata detaylarını inceleyin**
   - Hangi job başarısız oldu?
   - Hangi adımda hata oluştu?
   - Hata mesajı ne diyor?

3. **Yerel olarak düzeltin**
   ```bash
   # Lint hatalarını kontrol et
   pnpm lint
   
   # TypeScript hatalarını kontrol et
   pnpm exec tsc --noEmit
   
   # Build testi yap
   pnpm build
   ```

4. **Düzeltmeleri commit edin ve push edin**
   ```bash
   git add .
   git commit -m "fix(ci): resolve linting errors"
   git push
   ```

### CI'ı Yerel Olarak Test Etme

CI'ı GitHub'a push etmeden önce yerel olarak test edebilirsiniz:

```bash
# Lint kontrolü
pnpm lint

# TypeScript type check
pnpm exec tsc --noEmit

# Build testi
pnpm build

# Prisma schema validation
pnpm prisma validate
```

### CodeQL Security Analysis

Proje ayrıca CodeQL ile otomatik güvenlik analizi yapar:
- JavaScript/TypeScript kod analizi
- Güvenlik açıklarının tespiti
- Haftalık otomatik tarama

## 🔍 Pull Request Süreci

1. **Branch oluştur:**
   ```bash
   git checkout -b feat/auth-user-registration
   ```

2. **Değişiklikleri yap ve commit et:**
   ```bash
   git add .
   git commit -m "feat(auth): add user registration endpoint"
   ```

3. **Branch'i push et:**
   ```bash
   git push origin feat/auth-user-registration
   ```

4. **Pull Request oluştur:**
   - GitHub'da PR aç
   - Açıklayıcı başlık ve açıklama ekle
   - İlgili issue'ları referans et

5. **CI Pipeline kontrolü:**
   - PR oluşturulduğunda CI otomatik çalışır
   - Tüm CI kontrolleri geçmeli (yeşil ✓)
   - CI başarısız olursa düzeltmeler yapılmalı

6. **Code review beklenir:**
   - Review sonrası değişiklikler yapılabilir
   - CI kontrolleri tekrar çalışır
   - Onaylandıktan sonra merge edilir

### PR Şablonu

```markdown
## Açıklama
Bu PR ne yapıyor?

## Değişiklik Türü
- [ ] Yeni özellik
- [ ] Hata düzeltmesi
- [ ] Refaktör
- [ ] Dokümantasyon

## Test Edildi mi?
- [ ] Evet, test edildi
- [ ] Test eklenmedi

## Screenshot (varsa)
[Ekran görüntüsü ekle]

## İlgili Issue
Closes #123
```

## ✅ Checklist

PR göndermeden önce:

- [ ] Kod ESLint kurallarına uyuyor (`pnpm lint`)
- [ ] TypeScript hataları yok (`pnpm exec tsc --noEmit`)
- [ ] Build başarılı (`pnpm build`)
- [ ] Prisma schema geçerli (`pnpm prisma validate`)
- [ ] Testler geçiyor (varsa)
- [ ] Dokümantasyon güncellendi (gerekirse)
- [ ] Commit mesajları conventional commits formatında
- [ ] Breaking changes varsa belirtildi
- [ ] CI pipeline başarılı (GitHub Actions'da yeşil ✓)

## 🐛 Hata Bildirimi

Hata bulduysanız:

1. Issue açın
2. Açıklayıcı başlık kullanın
3. Adımları detaylıca açıklayın
4. Beklenen ve gerçek davranışı karşılaştırın
5. Screenshot ekleyin (varsa)

## 💡 Özellik Önerisi

Yeni özellik önermek için:

1. Issue açın
2. Özelliği detaylıca açıklayın
3. Kullanım senaryolarını belirtin
4. Alternatif çözümleri düşünün

## 📚 Kaynaklar

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

Teşekkürler! 🎉

