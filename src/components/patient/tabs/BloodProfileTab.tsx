'use client'

import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BloodProfileTabProps {
  patient: any
}

export default function BloodProfileTab({ patient }: BloodProfileTabProps) {
  const router = useRouter()
  const bloodProfile = patient.bloodProfile || {}

  const [bloodType, setBloodType] = useState(bloodProfile.bloodType || '')
  const [rhFactor, setRhFactor] = useState(bloodProfile.rhFactor || '')
  const [verified, setVerified] = useState(bloodProfile.verified || false)
  const [donations, setDonations] = useState<any[]>(bloodProfile.donations || [])
  const [bpReadings, setBpReadings] = useState<any[]>(bloodProfile.bpReadings || [])
  const [sugarReadings, setSugarReadings] = useState<any[]>(bloodProfile.sugarReadings || [])
  const [saving, setSaving] = useState(false)

  // Modal states
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [showBPModal, setShowBPModal] = useState(false)
  const [showSugarModal, setShowSugarModal] = useState(false)

  // Form states
  const [donationDate, setDonationDate] = useState('')
  const [donationLocation, setDonationLocation] = useState('')
  const [donationVolume, setDonationVolume] = useState('450')
  const [bpSystolic, setBpSystolic] = useState('')
  const [bpDiastolic, setBpDiastolic] = useState('')
  const [sugarType, setSugarType] = useState('Fasting')
  const [sugarValue, setSugarValue] = useState('')

  const totalVolume = donations.reduce((sum: number, d: any) => sum + (d.volume || 0), 0)

  const addDonation = () => {
    if (!donationDate) return
    const newDonation = {
      id: `donation-${Date.now()}`,
      date: donationDate,
      location: donationLocation,
      volume: parseInt(donationVolume) || 450,
      createdAt: new Date().toISOString(),
    }
    setDonations([...donations, newDonation])
    setShowDonationModal(false)
    setDonationDate('')
    setDonationLocation('')
    setDonationVolume('450')
  }

  const addBPReading = () => {
    if (!bpSystolic || !bpDiastolic) return
    const newReading = {
      id: `bp-${Date.now()}`,
      datetime: new Date().toISOString(),
      systolic: parseInt(bpSystolic),
      diastolic: parseInt(bpDiastolic),
    }
    setBpReadings([...bpReadings, newReading])
    setShowBPModal(false)
    setBpSystolic('')
    setBpDiastolic('')
  }

  const addSugarReading = () => {
    if (!sugarValue) return
    const newReading = {
      id: `sugar-${Date.now()}`,
      datetime: new Date().toISOString(),
      type: sugarType,
      value: parseInt(sugarValue),
    }
    setSugarReadings([...sugarReadings, newReading])
    setShowSugarModal(false)
    setSugarValue('')
  }

  const saveBloodProfile = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/patients/${patient.id}/blood-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodType,
          rhFactor,
          verified,
          donations,
          bpReadings,
          sugarReadings,
        }),
      })

      if (response.ok) {
        router.refresh()
        alert('Blood profile saved successfully!')
      } else {
        alert('Error saving blood profile')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving blood profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Blood Type & RH Factor */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          🔴 Blood Type & RH Factor
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Type</label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Not specified</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">RH Factor</label>
            <select
              value={rhFactor}
              onChange={(e) => setRhFactor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Not specified</option>
              <option value="positive">Positive (+)</option>
              <option value="negative">Negative (-)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Verified</label>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                className="form-checkbox text-purple-600 rounded"
              />
              <span className="text-sm">Lab confirmed</span>
            </label>
          </div>
        </div>
      </div>

      {/* Blood Donation History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            🩸 Blood Donation History ({donations.length})
          </h3>
          <button
            onClick={() => setShowDonationModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Donation
          </button>
        </div>
        <div className="space-y-2 mb-4">
          {donations.length > 0 ? (
            donations.map((d: any) => (
              <div
                key={d.id}
                className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <div>
                  <span className="font-semibold text-red-800">🩸 {d.date}</span>
                  <span className="text-sm text-gray-600 ml-2">{d.location || 'Unknown location'}</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  {d.volume || 450}ml
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No donation records yet</p>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total Donations</p>
            <p className="text-2xl font-bold text-blue-600">{donations.length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-2xl font-bold text-purple-600">{totalVolume} ml</p>
          </div>
        </div>
      </div>

      {/* Blood Pressure */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            📈 Blood Pressure ({bpReadings.length})
          </h3>
          <button
            onClick={() => setShowBPModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reading
          </button>
        </div>
        <div className="space-y-2">
          {bpReadings.length > 0 ? (
            bpReadings
              .slice(-5)
              .reverse()
              .map((r: any) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <span className="text-sm text-gray-600">
                    {new Date(r.datetime).toLocaleString()}
                  </span>
                  <span className="font-bold text-green-600">
                    {r.systolic}/{r.diastolic}
                  </span>
                </div>
              ))
          ) : (
            <p className="text-sm text-gray-500 italic">No blood pressure readings yet</p>
          )}
        </div>
      </div>

      {/* Blood Sugar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            🍬 Blood Sugar ({sugarReadings.length})
          </h3>
          <button
            onClick={() => setShowSugarModal(true)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition text-sm font-semibold flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reading
          </button>
        </div>
        <div className="space-y-2">
          {sugarReadings.length > 0 ? (
            sugarReadings
              .slice(-5)
              .reverse()
              .map((r: any) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-pink-50 border border-pink-200 rounded-lg p-3"
                >
                  <div>
                    <span className="text-sm text-gray-600">
                      {new Date(r.datetime).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({r.type})</span>
                  </div>
                  <span className="font-bold text-pink-600">{r.value} mg/dL</span>
                </div>
              ))
          ) : (
            <p className="text-sm text-gray-500 italic">No blood sugar readings yet</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveBloodProfile}
          disabled={saving}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Blood Profile'}
        </button>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">🩸 Add Donation Record</h3>
              <button onClick={() => setShowDonationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Donation Date</label>
                <input
                  type="date"
                  value={donationDate}
                  onChange={(e) => setDonationDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={donationLocation}
                  onChange={(e) => setDonationLocation(e.target.value)}
                  placeholder="e.g., Red Cross"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Volume (ml)</label>
                <input
                  type="number"
                  value={donationVolume}
                  onChange={(e) => setDonationVolume(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={addDonation}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setShowDonationModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BP Modal */}
      {showBPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">📈 Add Blood Pressure</h3>
              <button onClick={() => setShowBPModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Systolic</label>
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  placeholder="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Diastolic</label>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  placeholder="80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={addBPReading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setShowBPModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sugar Modal */}
      {showSugarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">🍬 Add Blood Sugar</h3>
              <button onClick={() => setShowSugarModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reading Type</label>
                <select
                  value={sugarType}
                  onChange={(e) => setSugarType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Fasting">Fasting</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="After Meal">After Meal (2hrs)</option>
                  <option value="Random">Random</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Value (mg/dL)</label>
                <input
                  type="number"
                  value={sugarValue}
                  onChange={(e) => setSugarValue(e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={addSugarReading}
                className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setShowSugarModal(false)}
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
