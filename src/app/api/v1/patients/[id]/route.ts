import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateApiKey, hasPermission } from '@/lib/api-auth'

// GET - Get single patient by ID (requires API key with 'read' permission)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate API key
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  if (!hasPermission(auth.apiKey!.permissions, 'read')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        medicalHistory: true,
        bloodProfile: true,
        dentalChart: true,
        treatmentPlans: true,
        files: true,
        visits: {
          orderBy: { date: 'desc' },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: patient,
    })
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json({ error: 'Failed to fetch patient' }, { status: 500 })
  }
}

// PUT - Update patient (requires API key with 'write' permission)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { name, email, phone, status, dateOfBirth, gender, address } = body

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(status && { status }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender !== undefined && { gender }),
        ...(address !== undefined && { address }),
      },
    })

    return NextResponse.json({
      success: true,
      data: patient,
    })
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 })
  }
}

// DELETE - Delete patient (requires API key with 'delete' permission)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate API key
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  if (!hasPermission(auth.apiKey!.permissions, 'delete')) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  try {
    await prisma.patient.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Patient deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json({ error: 'Failed to delete patient' }, { status: 500 })
  }
}
