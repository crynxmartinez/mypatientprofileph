import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// POST - Create a new patient (session-based auth for dashboard)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, city, status, dateOfBirth, gender, address } = body

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
        city,
        status: status || 'New',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        patientId: patient.id,
        action: 'Patient created',
        category: 'patient',
        details: `New patient ${patient.name} (${patient.patientId}) created`,
        performedBy: session.name || session.username,
      },
    })

    return NextResponse.json({
      success: true,
      patient,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 })
  }
}
