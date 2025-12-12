'use client'

import { useState } from 'react'
import { Save, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

interface DentalChartTabProps {
  patient: any
}

const TOOTH_CONDITIONS = [
  { value: '', label: 'Healthy', color: 'text-gray-400', border: 'border-gray-300', bg: 'bg-white' },
  { value: 'missing', label: 'Missing', color: 'text-red-500', border: 'border-red-400', bg: 'bg-red-50' },
  { value: 'cavity', label: 'Cavity', color: 'text-yellow-500', border: 'border-yellow-400', bg: 'bg-yellow-50' },
  { value: 'filling', label: 'Filling', color: 'text-blue-500', border: 'border-blue-400', bg: 'bg-blue-50' },
  { value: 'crown', label: 'Crown', color: 'text-purple-500', border: 'border-purple-400', bg: 'bg-purple-50' },
  { value: 'root-canal', label: 'Root Canal', color: 'text-green-500', border: 'border-green-400', bg: 'bg-green-50' },
  { value: 'implant', label: 'Implant', color: 'text-gray-600', border: 'border-gray-500', bg: 'bg-gray-100' },
  { value: 'bridge', label: 'Bridge', color: 'text-orange-500', border: 'border-orange-400', bg: 'bg-orange-50' },
  { value: 'attention', label: 'Needs Attention', color: 'text-pink-500', border: 'border-pink-400', bg: 'bg-pink-50' },
]

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

export default function DentalChartTab({ patient }: DentalChartTabProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const dentalChart = patient.dentalChart || {}
  
  const [teeth, setTeeth] = useState<Record<string, { condition: string; notes: string }>>(
    dentalChart.teeth || {}
  )
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)
  const [toothCondition, setToothCondition] = useState('')
  const [toothNotes, setToothNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const getToothStyle = (toothNum: number) => {
    const condition = teeth[toothNum]?.condition || ''
    const found = TOOTH_CONDITIONS.find((c) => c.value === condition)
    return found || TOOTH_CONDITIONS[0]
  }

  const selectTooth = (toothNum: number) => {
    setSelectedTooth(toothNum)
    const toothData = teeth[toothNum]
    setToothCondition(toothData?.condition || '')
    setToothNotes(toothData?.notes || '')
  }

  const saveToothData = () => {
    if (selectedTooth === null) return
    setTeeth({
      ...teeth,
      [selectedTooth]: {
        condition: toothCondition,
        notes: toothNotes,
      },
    })
    setSelectedTooth(null)
    setToothCondition('')
    setToothNotes('')
  }

  const saveDentalChart = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/patients/${patient.id}/dental-chart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teeth }),
      })

      if (response.ok) {
        router.refresh()
        showToast('Dental chart saved successfully!', 'success')
      } else {
        showToast('Error saving dental chart', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('Error saving dental chart', 'error')
    } finally {
      setSaving(false)
    }
  }

  const renderTooth = (toothNum: number) => {
    const style = getToothStyle(toothNum)
    const hasData = teeth[toothNum]?.condition

    return (
      <button
        key={toothNum}
        onClick={() => selectTooth(toothNum)}
        className={`w-10 h-14 md:w-12 md:h-16 ${style.bg} border-2 ${style.border} rounded-lg hover:border-purple-500 hover:shadow-md transition flex flex-col items-center justify-center text-xs font-semibold relative`}
      >
        <span className={`text-xl md:text-2xl ${style.color}`}>🦷</span>
        <span className="text-gray-600 text-[10px] md:text-xs">{toothNum}</span>
        {hasData && (
          <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-purple-500 rounded-full"></div>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">🦷 Interactive Dental Chart</h3>

        {/* Upper Teeth */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Upper Teeth</h4>
          <div className="flex justify-center gap-1 md:gap-2 flex-wrap">
            {UPPER_TEETH.map((tooth) => renderTooth(tooth))}
          </div>
        </div>

        {/* Lower Teeth */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Lower Teeth</h4>
          <div className="flex justify-center gap-1 md:gap-2 flex-wrap">
            {LOWER_TEETH.map((tooth) => renderTooth(tooth))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-gray-800 mb-3">Legend:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
            {TOOTH_CONDITIONS.map((condition) => (
              <div key={condition.value || 'healthy'} className="flex items-center space-x-2">
                <span className={condition.color}>🦷</span>
                <span>{condition.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tooth Details Panel */}
        {selectedTooth !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-blue-800">Tooth #{selectedTooth} Details</h4>
              <button
                onClick={() => setSelectedTooth(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                <select
                  value={toothCondition}
                  onChange={(e) => setToothCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {TOOTH_CONDITIONS.map((condition) => (
                    <option key={condition.value || 'healthy'} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={toothNotes}
                  onChange={(e) => setToothNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add notes about this tooth..."
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={saveToothData}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Save Tooth
                </button>
                <button
                  onClick={() => setSelectedTooth(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveDentalChart}
          disabled={saving}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Dental Chart'}
        </button>
      </div>
    </div>
  )
}
