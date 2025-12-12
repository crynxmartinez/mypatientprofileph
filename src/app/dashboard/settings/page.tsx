import { getSession } from '@/lib/auth'
import { User, Shield, Database } from 'lucide-react'
import ApiKeyManager from '@/components/settings/ApiKeyManager'

export default async function SettingsPage() {
  const session = await getSession()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your application settings</p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 ml-3">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={session?.username || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={session?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 ml-3">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Change Password</label>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold">
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 ml-3">Database</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Provider</p>
              <p className="text-lg font-semibold text-gray-800">PostgreSQL</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Host</p>
              <p className="text-lg font-semibold text-gray-800">Prisma Accelerate</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold text-green-600">Connected</p>
            </div>
          </div>
        </div>
        </div>

        {/* API Keys */}
        <ApiKeyManager />
      </div>
    </div>
  )
}
