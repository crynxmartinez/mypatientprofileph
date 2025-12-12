import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Users, Activity, Calendar, Heart } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getSession()
  
  // Get stats
  const totalPatients = await prisma.patient.count()
  const activePatients = await prisma.patient.count({ where: { status: 'Active' } })
  const newPatients = await prisma.patient.count({ where: { status: 'New' } })
  
  // Get recent patients
  const recentPatients = await prisma.patient.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      patientId: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      lastVisit: true,
    }
  })

  const stats = [
    { 
      name: 'Total Patients', 
      value: totalPatients, 
      icon: Users, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Active Patients', 
      value: activePatients, 
      icon: Activity, 
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'New Patients', 
      value: newPatients, 
      icon: Calendar, 
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    { 
      name: 'Blood Donors', 
      value: 0, 
      icon: Heart, 
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {session?.name || session?.username}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Patients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.patientId}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{patient.email || 'N/A'}</div>
                      <div className="text-xs text-gray-400">{patient.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        patient.status === 'Active' ? 'bg-green-100 text-green-800' :
                        patient.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {patient.lastVisit 
                        ? new Date(patient.lastVisit).toLocaleDateString() 
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No patients found. Add your first patient!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
