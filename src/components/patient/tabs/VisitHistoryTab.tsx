'use client'

interface VisitHistoryTabProps {
  patient: any
}

export default function VisitHistoryTab({ patient }: VisitHistoryTabProps) {
  const visits = patient.visits || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'No Show':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        📅 Complete Visit History ({visits.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Time
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Clinic
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visits.length > 0 ? (
              visits.map((visit: any) => (
                <tr key={visit.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {new Date(visit.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{visit.time || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    {visit.clinicName && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {visit.clinicName}
                      </span>
                    )}
                    {!visit.clinicName && 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm">{visit.doctorName || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{visit.serviceName || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(visit.status)}`}>
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {visit.notes || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No visit history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
