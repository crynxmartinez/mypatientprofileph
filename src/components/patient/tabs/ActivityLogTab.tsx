'use client'

import { useState } from 'react'
import { HeartPulse, FileText, ClipboardList, Droplets, Images, Circle } from 'lucide-react'

interface ActivityLogTabProps {
  patient: any
}

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All Activities' },
  { value: 'medical_history', label: 'Medical History' },
  { value: 'dental_chart', label: 'Dental Chart' },
  { value: 'treatment_plan', label: 'Treatment Plans' },
  { value: 'blood_profile', label: 'Blood Profile' },
  { value: 'files', label: 'Files' },
]

export default function ActivityLogTab({ patient }: ActivityLogTabProps) {
  const [filter, setFilter] = useState('all')
  const logs = patient.activityLogs || []

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter((log: any) => log.category === filter)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical_history':
        return <HeartPulse className="w-4 h-4 text-red-500" />
      case 'dental_chart':
        return <FileText className="w-4 h-4 text-blue-500" />
      case 'treatment_plan':
        return <ClipboardList className="w-4 h-4 text-green-500" />
      case 'blood_profile':
        return <Droplets className="w-4 h-4 text-pink-500" />
      case 'files':
        return <Images className="w-4 h-4 text-purple-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical_history':
        return 'border-red-200 bg-red-50'
      case 'dental_chart':
        return 'border-blue-200 bg-blue-50'
      case 'treatment_plan':
        return 'border-green-200 bg-green-50'
      case 'blood_profile':
        return 'border-pink-200 bg-pink-50'
      case 'files':
        return 'border-purple-200 bg-purple-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getTimeAgo = (date: Date | string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    return then.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          📜 Activity Log ({filteredLogs.length})
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          {CATEGORY_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log: any) => (
            <div
              key={log.id}
              className={`flex items-start space-x-3 p-3 border ${getCategoryColor(log.category)} rounded-lg`}
            >
              <div className="flex-shrink-0 mt-1">{getCategoryIcon(log.category)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                <p className="text-xs text-gray-600">{log.details || ''}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-400">{getTimeAgo(log.createdAt)}</span>
                  {log.performedBy && (
                    <span className="text-xs text-gray-400">• by {log.performedBy}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 italic text-center py-8">
            No activity logs found
          </div>
        )}
      </div>
    </div>
  )
}
