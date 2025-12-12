import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { allergies, medications, conditions, bloodPressure, emergencyContact } = body

    // Check if medical history exists
    const existing = await prisma.medicalHistory.findUnique({
      where: { patientId: params.id },
    })

    if (existing) {
      // Update existing
      await prisma.medicalHistory.update({
        where: { patientId: params.id },
        data: {
          allergies,
          medications,
          conditions,
          bloodPressure,
          emergencyContact,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new
      await prisma.medicalHistory.create({
        data: {
          patientId: params.id,
          allergies,
          medications,
          conditions,
          bloodPressure,
          emergencyContact,
        },
      })
    }

    // Log the activity
    await prisma.activityLog.create({
      data: {
        patientId: params.id,
        action: 'Updated Medical History',
        category: 'medical_history',
        details: `Allergies: ${allergies?.length || 0}, Medications: ${medications?.length || 0}, Conditions: ${conditions?.length || 0}`,
        performedBy: 'Admin',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating medical history:', error)
    return NextResponse.json({ error: 'Failed to update medical history' }, { status: 500 })
  }
}
