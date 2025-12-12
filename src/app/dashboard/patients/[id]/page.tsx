import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PatientTabs from '@/components/patient/PatientTabs'

interface PatientPageProps {
  params: { id: string }
}

export default async function PatientProfilePage({ params }: PatientPageProps) {
  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      medicalHistory: true,
      bloodProfile: true,
      dentalChart: true,
      treatmentPlans: true,
      files: true,
      visits: true,
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  })

  if (!patient) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-500',
    'Inactive': 'bg-red-500',
    'New': 'bg-blue-500',
  }

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link
        href="/dashboard/patients"
        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Patient List
      </Link>

      {/* Patient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{patient.name}</h1>
            <p className="text-lg opacity-90">Patient ID: {patient.patientId}</p>
          </div>
          <div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[patient.status] || 'bg-gray-500'} text-white`}>
              {patient.status}
            </span>
          </div>
        </div>
      </div>

      {/* Patient Tabs */}
      <PatientTabs patient={patient} />
    </div>
  )
}
