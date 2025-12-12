'use client'

interface OverviewTabProps {
  patient: any
}

export default function OverviewTab({ patient }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Contact & Visit Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Email:</span>{' '}
              <span className="font-semibold">{patient.email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>{' '}
              <span className="font-semibold">{patient.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Patient ID:</span>{' '}
              <span className="font-semibold">{patient.patientId}</span>
            </div>
            <div>
              <span className="text-gray-600">Date of Birth:</span>{' '}
              <span className="font-semibold">
                {patient.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Gender:</span>{' '}
              <span className="font-semibold">{patient.gender || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Address:</span>{' '}
              <span className="font-semibold">{patient.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Visit Summary</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Total Visits:</span>{' '}
              <span className="font-semibold">{patient.totalVisits || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Last Visit:</span>{' '}
              <span className="font-semibold">
                {patient.lastVisit
                  ? new Date(patient.lastVisit).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>{' '}
              <span className="font-semibold">{patient.status}</span>
            </div>
            <div>
              <span className="text-gray-600">Registered:</span>{' '}
              <span className="font-semibold">
                {new Date(patient.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Medical Info */}
      {patient.medicalHistory && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Medical Info</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Allergies</h4>
              <div className="text-sm text-red-700">
                {patient.medicalHistory.allergies?.length > 0
                  ? patient.medicalHistory.allergies.join(', ')
                  : 'None recorded'}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💊 Medications</h4>
              <div className="text-sm text-blue-700">
                {patient.medicalHistory.medications?.length > 0
                  ? patient.medicalHistory.medications.join(', ')
                  : 'None recorded'}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🏥 Conditions</h4>
              <div className="text-sm text-green-700">
                {patient.medicalHistory.conditions?.length > 0
                  ? patient.medicalHistory.conditions.join(', ')
                  : 'None recorded'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Visits */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Visits</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Doctor
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Service
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patient.visits && patient.visits.length > 0 ? (
                patient.visits.slice(0, 5).map((visit: any) => (
                  <tr key={visit.id}>
                    <td className="px-4 py-3 text-sm">
                      {new Date(visit.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{visit.doctorName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{visit.serviceName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          visit.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : visit.status === 'Scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {visit.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No visits yet
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
