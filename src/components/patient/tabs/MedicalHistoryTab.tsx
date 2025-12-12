'use client'

import { useState } from 'react'
import { Plus, X, Save, AlertTriangle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

interface MedicalHistoryTabProps {
  patient: any
}

const CONDITIONS_LIST = [
  'Diabetes',
  'High Blood Pressure',
  'Heart Disease',
  'Asthma',
  'Pregnancy',
  'Bleeding Disorder',
  'Kidney Disease',
  'Liver Disease',
  'Cancer',
  'HIV/AIDS',
]

export default function MedicalHistoryTab({ patient }: MedicalHistoryTabProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const medicalHistory = patient.medicalHistory || {}
  
  const [allergies, setAllergies] = useState<string[]>(medicalHistory.allergies || [])
  const [medications, setMedications] = useState<string[]>(medicalHistory.medications || [])
  const [conditions, setConditions] = useState<string[]>(medicalHistory.conditions || [])
  const [bloodPressure, setBloodPressure] = useState(medicalHistory.bloodPressure || '')
  const [emergencyContact, setEmergencyContact] = useState(medicalHistory.emergencyContact || '')
  const [newAllergy, setNewAllergy] = useState('')
  const [newMedication, setNewMedication] = useState('')
  const [saving, setSaving] = useState(false)

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()])
      setNewAllergy('')
    }
  }

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy))
  }

  const addMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications([...medications, newMedication.trim()])
      setNewMedication('')
    }
  }

  const removeMedication = (medication: string) => {
    setMedications(medications.filter((m) => m !== medication))
  }

  const toggleCondition = (condition: string) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter((c) => c !== condition))
    } else {
      setConditions([...conditions, condition])
    }
  }

  const saveMedicalHistory = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/patients/${patient.id}/medical-history`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allergies,
          medications,
          conditions,
          bloodPressure,
          emergencyContact,
        }),
      })

      if (response.ok) {
        router.refresh()
        showToast('Medical history saved successfully!', 'success')
      } else {
        showToast('Error saving medical history', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showToast('Error saving medical history', 'error')
    } finally {
      setSaving(false)
    }
  }

  const isIncomplete = allergies.length === 0 && medications.length === 0

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {isIncomplete && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-yellow-800 mb-2">
                ⚠️ Incomplete Medical Profile
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                Critical information is missing. Please complete the medical history.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Allergies */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-red-600 flex items-center">
            ⚠️ ALLERGIES ({allergies.length})
          </h3>
        </div>
        <div className="space-y-2 mb-4">
          {allergies.length > 0 ? (
            allergies.map((allergy) => (
              <div
                key={allergy}
                className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <span className="text-sm text-red-800 font-semibold">⚠️ {allergy}</span>
                <button
                  onClick={() => removeAllergy(allergy)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              No allergies recorded.
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            placeholder="Enter allergy (e.g., Penicillin)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={addAllergy}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medications */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            💊 Current Medications ({medications.length})
          </h3>
        </div>
        <div className="space-y-2 mb-4">
          {medications.length > 0 ? (
            medications.map((medication) => (
              <div
                key={medication}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <span className="text-sm text-blue-800">💊 {medication}</span>
                <button
                  onClick={() => removeMedication(medication)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No medications recorded</div>
          )}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            placeholder="Enter medication (e.g., Metformin 500mg)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={addMedication}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          🏥 Medical Conditions
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {CONDITIONS_LIST.map((condition) => (
            <label
              key={condition}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={conditions.includes(condition)}
                onChange={() => toggleCondition(condition)}
                className="form-checkbox text-purple-600 rounded"
              />
              <span className="text-sm">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Vital Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          ❤️ Vital Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Blood Pressure
            </label>
            <input
              type="text"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="120/80"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Emergency Contact
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="09123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveMedicalHistory}
          disabled={saving}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Medical History'}
        </button>
      </div>
    </div>
  )
}
