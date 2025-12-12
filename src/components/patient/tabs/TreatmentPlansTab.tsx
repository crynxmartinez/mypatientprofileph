'use client'

import { useState } from 'react'
import { Plus, Check, RotateCcw, Trash2, Clock, Calendar, Loader2, CheckCircle, XCircle, Ban } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TreatmentPlansTabProps {
  patient: any
}

const PROCEDURE_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-gray-400' },
  { value: 'scheduled', label: 'Scheduled', icon: Calendar, color: 'text-blue-500' },
  { value: 'in-progress', label: 'In Progress', icon: Loader2, color: 'text-yellow-500' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-500' },
  { value: 'failed', label: 'Failed', icon: XCircle, color: 'text-red-500' },
  { value: 'cancelled', label: 'Cancelled', icon: Ban, color: 'text-gray-500' },
]

export default function TreatmentPlansTab({ patient }: TreatmentPlansTabProps) {
  const router = useRouter()
  const [plans, setPlans] = useState<any[]>(patient.treatmentPlans || [])
  const [showNewPlanModal, setShowNewPlanModal] = useState(false)
  const [showProcedureModal, setShowProcedureModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [newPlanTitle, setNewPlanTitle] = useState('')
  const [procName, setProcName] = useState('')
  const [procDate, setProcDate] = useState('')
  const [procNotes, setProcNotes] = useState('')
  const [procStatus, setProcStatus] = useState('pending')
  const [saving, setSaving] = useState(false)

  const activePlans = plans.filter((p) => p.status === 'active')
  const completedPlans = plans.filter((p) => p.status === 'completed')

  const createPlan = async () => {
    if (!newPlanTitle.trim()) return
    setSaving(true)
    try {
      const newPlan = {
        id: `plan-${Date.now()}`,
        title: newPlanTitle,
        status: 'active',
        createdAt: new Date().toISOString(),
        procedures: [],
      }
      const updatedPlans = [...plans, newPlan]
      
      const response = await fetch(`/api/patients/${patient.id}/treatment-plans`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentPlans: updatedPlans }),
      })

      if (response.ok) {
        setPlans(updatedPlans)
        setShowNewPlanModal(false)
        setNewPlanTitle('')
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const addProcedure = async () => {
    if (!procName.trim() || !selectedPlanId) return
    setSaving(true)
    try {
      const newProcedure = {
        id: `proc-${Date.now()}`,
        name: procName,
        date: procDate,
        notes: procNotes,
        status: procStatus,
        createdAt: new Date().toISOString(),
      }

      const updatedPlans = plans.map((plan) => {
        if (plan.id === selectedPlanId) {
          return {
            ...plan,
            procedures: [...(plan.procedures || []), newProcedure],
          }
        }
        return plan
      })

      const response = await fetch(`/api/patients/${patient.id}/treatment-plans`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentPlans: updatedPlans }),
      })

      if (response.ok) {
        setPlans(updatedPlans)
        setShowProcedureModal(false)
        setProcName('')
        setProcDate('')
        setProcNotes('')
        setProcStatus('pending')
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateProcedureStatus = async (planId: string, procId: string, newStatus: string) => {
    const updatedPlans = plans.map((plan) => {
      if (plan.id === planId) {
        return {
          ...plan,
          procedures: plan.procedures.map((proc: any) =>
            proc.id === procId ? { ...proc, status: newStatus } : proc
          ),
        }
      }
      return plan
    })

    try {
      const response = await fetch(`/api/patients/${patient.id}/treatment-plans`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentPlans: updatedPlans }),
      })

      if (response.ok) {
        setPlans(updatedPlans)
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const completePlan = async (planId: string) => {
    const updatedPlans = plans.map((plan) =>
      plan.id === planId
        ? { ...plan, status: 'completed', completedAt: new Date().toISOString() }
        : plan
    )

    try {
      const response = await fetch(`/api/patients/${patient.id}/treatment-plans`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentPlans: updatedPlans }),
      })

      if (response.ok) {
        setPlans(updatedPlans)
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const reopenPlan = async (planId: string) => {
    const updatedPlans = plans.map((plan) => {
      if (plan.id === planId) {
        const { completedAt, ...rest } = plan
        return { ...rest, status: 'active' }
      }
      return plan
    })

    try {
      const response = await fetch(`/api/patients/${patient.id}/treatment-plans`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentPlans: updatedPlans }),
      })

      if (response.ok) {
        setPlans(updatedPlans)
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deletePlan = async (planId: string) => {
    if (!confirm('Delete this treatment plan?')) return
    const updatedPlans = plans.filter((plan) => plan.id !== planId)

    try {
      const response = await fetch(`/api/patients/${patient.id}/treatment-plans`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentPlans: updatedPlans }),
      })

      if (response.ok) {
        setPlans(updatedPlans)
        router.refresh()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const renderPlan = (plan: any, isCompleted: boolean = false) => {
    const procedures = plan.procedures || []
    const successCount = procedures.filter((p: any) => p.status === 'success').length
    const totalCount = procedures.length
    const progress = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0

    return (
      <div
        key={plan.id}
        className={`border-2 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-purple-200 bg-purple-50'} rounded-xl p-4`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-gray-800 text-lg">{plan.title}</h4>
            <p className="text-xs text-gray-500">
              Created: {new Date(plan.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {!isCompleted ? (
              <>
                <button
                  onClick={() => {
                    setSelectedPlanId(plan.id)
                    setShowProcedureModal(true)
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-xs font-semibold flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Procedure
                </button>
                <button
                  onClick={() => completePlan(plan.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-xs font-semibold flex items-center"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Complete
                </button>
              </>
            ) : (
              <button
                onClick={() => reopenPlan(plan.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-xs font-semibold flex items-center"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reopen
              </button>
            )}
            <button
              onClick={() => deletePlan(plan.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-xs font-semibold"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>
              {successCount}/{totalCount} procedures ({progress}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Procedures List */}
        <div className="space-y-2">
          {procedures.length > 0 ? (
            procedures.map((proc: any) => {
              const statusInfo = PROCEDURE_STATUSES.find((s) => s.value === proc.status) || PROCEDURE_STATUSES[0]
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={proc.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{proc.name}</p>
                      <p className="text-xs text-gray-500">
                        {proc.date ? new Date(proc.date).toLocaleDateString() : 'No date set'}
                        {proc.notes && ` • ${proc.notes}`}
                      </p>
                    </div>
                  </div>
                  <select
                    value={proc.status}
                    onChange={(e) => updateProcedureStatus(plan.id, proc.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    {PROCEDURE_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-2">
              No procedures added yet
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Plans */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            📋 Active Treatment Plans ({activePlans.length})
          </h3>
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Plan
          </button>
        </div>
        <div className="space-y-4">
          {activePlans.length > 0 ? (
            activePlans.map((plan) => renderPlan(plan, false))
          ) : (
            <div className="text-sm text-gray-500 italic text-center py-8">
              No active treatment plans
            </div>
          )}
        </div>
      </div>

      {/* Completed Plans */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          ✅ Completed Treatment Plans ({completedPlans.length})
        </h3>
        <div className="space-y-4">
          {completedPlans.length > 0 ? (
            completedPlans.map((plan) => renderPlan(plan, true))
          ) : (
            <div className="text-sm text-gray-500 italic">No completed treatment plans</div>
          )}
        </div>
      </div>

      {/* New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Create Treatment Plan</h3>
            <input
              type="text"
              value={newPlanTitle}
              onChange={(e) => setNewPlanTitle(e.target.value)}
              placeholder="Enter treatment plan title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={createPlan}
                disabled={saving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Plan'}
              </button>
              <button
                onClick={() => setShowNewPlanModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Procedure Modal */}
      {showProcedureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add Procedure</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Procedure Name</label>
                <input
                  type="text"
                  value={procName}
                  onChange={(e) => setProcName(e.target.value)}
                  placeholder="e.g., X-Ray, Cleaning"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  value={procDate}
                  onChange={(e) => setProcDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <input
                  type="text"
                  value={procNotes}
                  onChange={(e) => setProcNotes(e.target.value)}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={procStatus}
                  onChange={(e) => setProcStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={addProcedure}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Procedure'}
              </button>
              <button
                onClick={() => setShowProcedureModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
