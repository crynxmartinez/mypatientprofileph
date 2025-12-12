import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { bloodType, rhFactor, verified, donations, bpReadings, sugarReadings } = body

    // Check if blood profile exists
    const existing = await prisma.bloodProfile.findUnique({
      where: { patientId: params.id },
    })

    if (existing) {
      // Update existing
      await prisma.bloodProfile.update({
        where: { patientId: params.id },
        data: {
          bloodType,
          rhFactor,
          verified,
          donations,
          bpReadings,
          sugarReadings,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new
      await prisma.bloodProfile.create({
        data: {
          patientId: params.id,
          bloodType,
          rhFactor,
          verified,
          donations,
          bpReadings,
          sugarReadings,
        },
      })
    }

    // Log the activity
    await prisma.activityLog.create({
      data: {
        patientId: params.id,
        action: 'Updated Blood Profile',
        category: 'blood_profile',
        details: `Blood Type: ${bloodType || 'N/A'}${rhFactor ? (rhFactor === 'positive' ? '+' : '-') : ''}, Donations: ${donations?.length || 0}`,
        performedBy: 'Admin',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating blood profile:', error)
    return NextResponse.json({ error: 'Failed to update blood profile' }, { status: 500 })
  }
}
