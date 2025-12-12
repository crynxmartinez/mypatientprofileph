'use client'

import { useState, useEffect } from 'react'
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Check } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface ApiKey {
  id: string
  name: string
  keyPreview: string
  permissions: string[]
  lastUsedAt: string | null
  expiresAt: string | null
  isActive: boolean
  createdAt: string
}

export default function ApiKeyManager() {
  const { showToast } = useToast()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read'])
  const [creating, setCreating] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      const data = await response.json()
      if (data.apiKeys) {
        setApiKeys(data.apiKeys)
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      showToast('Failed to load API keys', 'error')
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      showToast('Please enter a name for the API key', 'warning')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName,
          permissions: newKeyPermissions,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewlyCreatedKey(data.apiKey.key)
        showToast('API key created successfully!', 'success')
        fetchApiKeys()
        setNewKeyName('')
        setNewKeyPermissions(['read'])
      } else {
        showToast(data.error || 'Failed to create API key', 'error')
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      showToast('Failed to create API key', 'error')
    } finally {
      setCreating(false)
    }
  }

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showToast('API key deleted', 'success')
        fetchApiKeys()
      } else {
        showToast('Failed to delete API key', 'error')
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      showToast('Failed to delete API key', 'error')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('API key copied to clipboard', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      showToast('Failed to copy', 'error')
    }
  }

  const togglePermission = (permission: string) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(newKeyPermissions.filter((p) => p !== permission))
    } else {
      setNewKeyPermissions([...newKeyPermissions, permission])
    }
  }

  const closeNewKeyModal = () => {
    setNewlyCreatedKey(null)
    setShowKey(false)
    setShowModal(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Key className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 ml-3">API Keys</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </button>
      </div>

      <p className="text-gray-500 text-sm mb-4">
        Create API keys to allow external applications to access the MyPatientPH API.
      </p>

      {/* API Keys List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <Key className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No API keys yet</p>
          <p className="text-sm">Create your first API key to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{key.name}</span>
                  {!key.isActive && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                      Disabled
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                  <span className="font-mono">****{key.keyPreview}</span>
                  <span>•</span>
                  <span>{key.permissions.join(', ')}</span>
                  {key.lastUsedAt && (
                    <>
                      <span>•</span>
                      <span>Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteApiKey(key.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create API Key Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {newlyCreatedKey ? (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4">🔑 API Key Created!</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm font-semibold mb-2">
                    ⚠️ Copy your API key now. You won't be able to see it again!
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-mono break-all">
                      {showKey ? newlyCreatedKey : '•'.repeat(40)}
                    </code>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={closeNewKeyModal}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Create API Key</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Key Name
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Mobile App, Integration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="space-y-2">
                      {['read', 'write', 'delete'].map((perm) => (
                        <label key={perm} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newKeyPermissions.includes(perm)}
                            onChange={() => togglePermission(perm)}
                            className="form-checkbox text-purple-600 rounded"
                          />
                          <span className="text-sm capitalize">{perm}</span>
                          <span className="text-xs text-gray-400">
                            {perm === 'read' && '- View patient data'}
                            {perm === 'write' && '- Create/update data'}
                            {perm === 'delete' && '- Delete records'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-6">
                  <button
                    onClick={createApiKey}
                    disabled={creating}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Key'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
