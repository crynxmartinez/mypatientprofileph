import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { teeth } = body

    // Check if dental chart exists
    const existing = await prisma.dentalChart.findUnique({
      where: { patientId: params.id },
    })

    if (existing) {
      // Update existing
      await prisma.dentalChart.update({
        where: { patientId: params.id },
        data: {
          teeth,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new
      await prisma.dentalChart.create({
        data: {
          patientId: params.id,
          teeth,
        },
      })
    }

    // Count teeth with conditions
    const teethWithConditions = Object.values(teeth || {}).filter(
      (t: any) => t.condition && t.condition !== ''
    ).length

    // Log the activity
    await prisma.activityLog.create({
      data: {
        patientId: params.id,
        action: 'Updated Dental Chart',
        category: 'dental_chart',
        details: `${teethWithConditions} teeth with recorded conditions`,
        performedBy: 'Admin',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating dental chart:', error)
    return NextResponse.json({ error: 'Failed to update dental chart' }, { status: 500 })
  }
}
