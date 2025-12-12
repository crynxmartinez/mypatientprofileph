import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, hasPermission } from '@/lib/api-auth'

// GET - List all patients (requires API key with 'read' permission)
export async function GET(request: NextRequest) {
  // Validate API key
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  if (!hasPermission(auth.apiKey!.permissions, 'read')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { patientId: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get patients with pagination
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          medicalHistory: true,
          bloodProfile: true,
        },
      }),
      prisma.patient.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        patients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
}

// POST - Create a new patient (requires API key with 'write' permission)
export async function POST(request: NextRequest) {
  // Validate API key
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  if (!hasPermission(auth.apiKey!.permissions, 'write')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { name, email, phone, status, dateOfBirth, gender, address, city } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Generate patient ID
    const lastPatient = await prisma.patient.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { patientId: true },
    })

    let nextId = 1
    if (lastPatient?.patientId) {
      const match = lastPatient.patientId.match(/PAT-(\d+)/)
      if (match) {
        nextId = parseInt(match[1]) + 1
      }
    }
    const patientId = `PAT-${String(nextId).padStart(3, '0')}`

    const patient = await prisma.patient.create({
      data: {
        patientId,
        name,
        email,
        phone,
        status: status || 'New',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
        city,
      },
    })

    return NextResponse.json({
      success: true,
      data: patient,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
  }
}
