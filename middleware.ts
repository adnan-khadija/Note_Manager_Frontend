import { NextRequest, NextResponse } from 'next/server'

// Définir les routes protégées
const protectedRoutes = ['/sharedNotes', '/notes', '/home','/settings']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Vérifie si on accède à une route protégée
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected) {
    const token = req.cookies.get('token')?.value
    // Rediriger si aucun token
    if (!token) {
      const loginUrl = new URL('/', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Optionnel : valider le token côté serveur ici (non obligatoire)
  }

  return NextResponse.next()
}
