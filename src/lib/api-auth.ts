import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Hash the API key for comparison
function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export interface ApiKeyValidation {
  valid: boolean
  apiKey?: {
    id: string
    name: string
    adminId: string
    permissions: string[]
  }
  error?: string
}

// Validate API key from request header
export async function validateApiKey(request: NextRequest): Promise<ApiKeyValidation> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader) {
    return { valid: false, error: 'No Authorization header' }
  }

  // Expect format: Bearer mpph_xxxxx
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { valid: false, error: 'Invalid Authorization format. Use: Bearer <api_key>' }
  }

  const rawKey = parts[1]
  if (!rawKey.startsWith('mpph_')) {
    return { valid: false, error: 'Invalid API key format' }
  }

  const hashedKey = hashApiKey(rawKey)

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: hashedKey },
    })

    if (!apiKey) {
      return { valid: false, error: 'Invalid API key' }
    }

    if (!apiKey.isActive) {
      return { valid: false, error: 'API key is disabled' }
    }

    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return { valid: false, error: 'API key has expired' }
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })

    return {
      valid: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        adminId: apiKey.adminId,
        permissions: apiKey.permissions,
      },
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Failed to validate API key' }
  }
}

// Check if API key has specific permission
export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.includes(required) || permissions.includes('admin')
}
