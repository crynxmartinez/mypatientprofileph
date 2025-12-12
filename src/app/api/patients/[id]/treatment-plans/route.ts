import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { treatmentPlans } = body

    // Delete existing treatment plans for this patient
    await prisma.treatmentPlan.deleteMany({
      where: { patientId: params.id },
    })

    // Create new treatment plans
    if (treatmentPlans && treatmentPlans.length > 0) {
      await prisma.treatmentPlan.createMany({
        data: treatmentPlans.map((plan: any) => ({
          patientId: params.id,
          planId: plan.id,
          title: plan.title,
          status: plan.status,
          procedures: plan.procedures || [],
          completedAt: plan.completedAt ? new Date(plan.completedAt) : null,
        })),
      })
    }

    // Log the activity
    const activePlans = treatmentPlans?.filter((p: any) => p.status === 'active').length || 0
    const completedPlans = treatmentPlans?.filter((p: any) => p.status === 'completed').length || 0

    await prisma.activityLog.create({
      data: {
        patientId: params.id,
        action: 'Updated Treatment Plans',
        category: 'treatment_plan',
        details: `Active: ${activePlans}, Completed: ${completedPlans}`,
        performedBy: 'Admin',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating treatment plans:', error)
    return NextResponse.json({ error: 'Failed to update treatment plans' }, { status: 500 })
  }
}
