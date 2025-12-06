// Static export için API route'ları devre dışı bırak
export const dynamic = 'force-static'
export const revalidate = false

// Dynamic route için generateStaticParams gerekli (static export için)
export function generateStaticParams() {
  // API route'u static export'ta kullanmayacağız, boş array döndür
  return []
}

// GitHub Pages için static export - API routes çalışmaz
// Bu route sadece static export için 404 döndürür
export async function GET() {
  return new Response('API routes are not available in static export', { status: 404 })
}

export async function POST() {
  return new Response('API routes are not available in static export', { status: 404 })
}

