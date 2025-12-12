'use client'

import { useState } from 'react'
import { 
  Home, 
  HeartPulse, 
  Droplets, 
  FileText, 
  Images, 
  ClipboardList, 
  Calendar, 
  History 
} from 'lucide-react'
import OverviewTab from './tabs/OverviewTab'
import MedicalHistoryTab from './tabs/MedicalHistoryTab'
import BloodProfileTab from './tabs/BloodProfileTab'
import DentalChartTab from './tabs/DentalChartTab'
import FilesTab from './tabs/FilesTab'
import TreatmentPlansTab from './tabs/TreatmentPlansTab'
import VisitHistoryTab from './tabs/VisitHistoryTab'
import ActivityLogTab from './tabs/ActivityLogTab'

interface PatientTabsProps {
  patient: any
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'medical', label: 'Medical History', icon: HeartPulse },
  { id: 'blood', label: 'Blood Profile', icon: Droplets },
  { id: 'dental', label: 'Dental Chart', icon: FileText },
  { id: 'files', label: 'Files & Images', icon: Images },
  { id: 'treatment', label: 'Treatment Plans', icon: ClipboardList },
  { id: 'visits', label: 'Visit History', icon: Calendar },
  { id: 'activity', label: 'Activity Log', icon: History },
]

export default function PatientTabs({ patient }: PatientTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab patient={patient} />
      case 'medical':
        return <MedicalHistoryTab patient={patient} />
      case 'blood':
        return <BloodProfileTab patient={patient} />
      case 'dental':
        return <DentalChartTab patient={patient} />
      case 'files':
        return <FilesTab patient={patient} />
      case 'treatment':
        return <TreatmentPlansTab patient={patient} />
      case 'visits':
        return <VisitHistoryTab patient={patient} />
      case 'activity':
        return <ActivityLogTab patient={patient} />
      default:
        return <OverviewTab patient={patient} />
    }
  }

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap space-x-1 px-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-3 border-b-2 font-semibold text-sm flex items-center whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  )
}
