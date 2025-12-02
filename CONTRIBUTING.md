# Katkıda Bulunma Rehberi

neuGPA projesine katkıda bulunmak istediğiniz için teşekkürler! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 📋 İçindekiler

- [Commit Kuralları](#commit-kuralları)
- [Branch Stratejisi](#branch-stratejisi)
- [Kod Standartları](#kod-standartları)
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

### Branch Tipleri

- `main` - Production-ready kod
- `develop` - Development branch (varsa)
- `feat/*` - Yeni özellikler
- `fix/*` - Hata düzeltmeleri
- `refactor/*` - Refaktörler

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

5. **Code review beklenir:**
   - Review sonrası değişiklikler yapılabilir
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

- [ ] Kod ESLint kurallarına uyuyor
- [ ] TypeScript hataları yok
- [ ] Testler geçiyor (varsa)
- [ ] Dokümantasyon güncellendi (gerekirse)
- [ ] Commit mesajları conventional commits formatında
- [ ] Breaking changes varsa belirtildi

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

Teşekkürler! 🎉

