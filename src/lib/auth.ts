import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'session'

export interface SessionUser {
  id: string
  username: string
  name: string | null
}

// Simple session management using cookies
export async function createSession(user: SessionUser): Promise<string> {
  const sessionData = JSON.stringify(user)
  const encoded = Buffer.from(sessionData).toString('base64')
  return encoded
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie?.value) {
    return null
  }
  
  try {
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    const user = JSON.parse(decoded) as SessionUser
    return user
  } catch {
    return null
  }
}

export async function login(username: string, password: string): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  try {
    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
    })
    
    if (!admin) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    // Compare password
    const isValid = await bcrypt.compare(password, admin.password)
    
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' }
    }
    
    const user: SessionUser = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
    }
    
    return { success: true, user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
