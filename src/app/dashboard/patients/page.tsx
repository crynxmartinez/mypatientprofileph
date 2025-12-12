import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'

export default async function PatientsPage() {
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      patientId: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      totalVisits: true,
      lastVisit: true,
    }
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
          <p className="text-gray-500 mt-1">Manage your patient records</p>
        </div>
        <Link
          href="/dashboard/patients/new"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Patient
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="New">New</option>
            </select>
          </div>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Visits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.patientId}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{patient.email || 'N/A'}</div>
                      <div className="text-xs text-gray-400">{patient.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.totalVisits}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {patient.lastVisit 
                        ? new Date(patient.lastVisit).toLocaleDateString() 
                        : 'N/A'}
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
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/patients/${patient.id}`}
                        className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
