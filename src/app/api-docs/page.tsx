import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">MyPatientPH API</h1>
              <p className="text-purple-200">REST API Documentation</p>
            </div>
          </div>
          <p className="text-lg text-purple-100 max-w-2xl">
            Complete API reference for integrating with the MyPatientPH patient management system.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Base URL */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🌐 Base URL</h2>
          <code className="bg-gray-100 px-4 py-2 rounded-lg text-purple-600 font-mono block">
            https://mypatientprofileph.vercel.app/api
          </code>
        </section>

        {/* Authentication */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔐 Authentication</h2>
          <p className="text-gray-600 mb-4">
            The API supports two authentication methods:
          </p>
          
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">1. API Key (Recommended)</h3>
              <p className="text-sm text-gray-600 mb-3">
                Generate an API key from Settings → API Keys in the admin dashboard.
              </p>
              <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                <p className="text-gray-400"># Include in request header:</p>
                <p>Authorization: Bearer mpph_your_api_key_here</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">2. Session Cookie</h3>
              <p className="text-sm text-gray-600">
                Login via the web interface to obtain a session cookie. Useful for browser-based integrations.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-4">
            <p className="text-yellow-800 text-sm">
              <strong>Security:</strong> API keys are shown only once when created. Store them securely!
            </p>
          </div>
        </section>

        {/* Quick Start */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Quick Start</h2>
          <p className="text-gray-600 mb-4">
            Use these examples to quickly integrate with the MyPatientPH API in your application.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <p className="text-gray-400 text-sm mb-2"># Fetch all patients (JavaScript/TypeScript)</p>
              <pre className="text-green-400 text-sm">{`const response = await fetch(
  'https://mypatientprofileph.vercel.app/api/v1/patients',
  {
    headers: {
      'Authorization': 'Bearer mpph_your_api_key_here',
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
console.log(data.data.patients);`}</pre>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <p className="text-gray-400 text-sm mb-2"># Fetch single patient with blood profile</p>
              <pre className="text-green-400 text-sm">{`const response = await fetch(
  'https://mypatientprofileph.vercel.app/api/v1/patients/PATIENT_ID',
  {
    headers: {
      'Authorization': 'Bearer mpph_your_api_key_here'
    }
  }
);
const { data } = await response.json();
console.log(data.patientId, data.city, data.bloodProfile?.bloodType);`}</pre>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <p className="text-gray-400 text-sm mb-2"># cURL example</p>
              <pre className="text-green-400 text-sm">{`curl -X GET "https://mypatientprofileph.vercel.app/api/v1/patients" \\
  -H "Authorization: Bearer mpph_your_api_key_here" \\
  -H "Content-Type: application/json"`}</pre>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📡 API Endpoints</h2>

          {/* V1 Patient Endpoints */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">Patients (v1 - API Key Auth)</h3>
            <p className="text-sm text-gray-500 mb-4">These endpoints require API key authentication via the Authorization header.</p>
            
            <div className="space-y-4">
              <EndpointCard
                method="GET"
                endpoint="/v1/patients"
                description="List all patients with pagination. Includes blood profile data."
                body={null}
                response={{ 
                  success: true, 
                  data: { 
                    patients: [{ patientId: 'PAT-001', name: 'string', city: 'string', bloodProfile: { bloodType: 'O', rhFactor: 'positive' } }],
                    pagination: { page: 1, limit: 50, total: 100, totalPages: 2 }
                  }
                }}
              />
              <EndpointCard
                method="GET"
                endpoint="/v1/patients/:id"
                description="Get single patient with all related data (medical history, blood profile, dental chart, etc.)"
                body={null}
                response={{ 
                  success: true, 
                  data: { 
                    id: 'string', 
                    patientId: 'PAT-001', 
                    name: 'string', 
                    city: 'string',
                    bloodProfile: { bloodType: 'O', rhFactor: 'positive' },
                    medicalHistory: { allergies: [], medications: [] }
                  }
                }}
              />
              <EndpointCard
                method="POST"
                endpoint="/v1/patients"
                description="Create a new patient"
                body={{ name: 'string (required)', email: 'string', phone: 'string', city: 'string', status: 'Active | Inactive | New' }}
                response={{ success: true, data: { id: 'string', patientId: 'PAT-002' } }}
              />
              <EndpointCard
                method="PUT"
                endpoint="/v1/patients/:id"
                description="Update patient information"
                body={{ name: 'string', email: 'string', phone: 'string', city: 'string', status: 'string' }}
                response={{ success: true, data: {} }}
              />
              <EndpointCard
                method="DELETE"
                endpoint="/v1/patients/:id"
                description="Delete a patient (requires delete permission)"
                body={null}
                response={{ success: true, message: 'Patient deleted successfully' }}
              />
            </div>
          </div>

          {/* Query Parameters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">Query Parameters</h3>
            <p className="text-sm text-gray-500 mb-4">Use these query parameters with GET /v1/patients</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Parameter</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Default</th>
                    <th className="px-4 py-2 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2 font-mono text-purple-600">page</td>
                    <td className="px-4 py-2">number</td>
                    <td className="px-4 py-2">1</td>
                    <td className="px-4 py-2">Page number for pagination</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-purple-600">limit</td>
                    <td className="px-4 py-2">number</td>
                    <td className="px-4 py-2">50</td>
                    <td className="px-4 py-2">Items per page (max 100)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-purple-600">status</td>
                    <td className="px-4 py-2">string</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">Filter by status: Active, Inactive, New</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-purple-600">search</td>
                    <td className="px-4 py-2">string</td>
                    <td className="px-4 py-2">-</td>
                    <td className="px-4 py-2">Search by name, email, or patient ID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Auth Endpoints */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">Authentication (Session-based)</h3>
            <p className="text-sm text-gray-500 mb-4">These endpoints use session cookies for web interface authentication.</p>
            
            <div className="space-y-4">
              <EndpointCard
                method="POST"
                endpoint="/auth/login"
                description="Authenticate user and create session"
                body={{ username: 'string', password: 'string' }}
                response={{ success: true, user: { id: 'string', username: 'string', name: 'string' } }}
              />
              <EndpointCard
                method="POST"
                endpoint="/auth/logout"
                description="End current session"
                body={null}
                response={{ success: true }}
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">Medical History</h3>
            
            <div className="space-y-4">
              <EndpointCard
                method="PUT"
                endpoint="/patients/:id/medical-history"
                description="Update patient medical history"
                body={{
                  allergies: ['string'],
                  medications: ['string'],
                  conditions: ['string'],
                  bloodPressure: 'string',
                  emergencyContact: 'string'
                }}
                response={{ success: true }}
              />
            </div>
          </div>

          {/* Blood Profile */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">Blood Profile</h3>
            
            <div className="space-y-4">
              <EndpointCard
                method="PUT"
                endpoint="/patients/:id/blood-profile"
                description="Update patient blood profile"
                body={{
                  bloodType: 'A | B | AB | O',
                  rhFactor: 'positive | negative',
                  verified: 'boolean',
                  donations: [{ date: 'string', location: 'string', volume: 'number' }],
                  bpReadings: [{ datetime: 'string', systolic: 'number', diastolic: 'number' }],
                  sugarReadings: [{ datetime: 'string', type: 'string', value: 'number' }]
                }}
                response={{ success: true }}
              />
            </div>
          </div>

          {/* Dental Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">Dental Chart</h3>
            
            <div className="space-y-4">
              <EndpointCard
                method="PUT"
                endpoint="/patients/:id/dental-chart"
                description="Update patient dental chart"
                body={{
                  teeth: {
                    '11': { condition: 'healthy | missing | cavity | filling | crown | root-canal | implant | bridge | attention', notes: 'string' }
                  }
                }}
                response={{ success: true }}
              />
            </div>
          </div>

          {/* Treatment Plans */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 border-b pb-2">Treatment Plans</h3>
            
            <div className="space-y-4">
              <EndpointCard
                method="PUT"
                endpoint="/patients/:id/treatment-plans"
                description="Update patient treatment plans"
                body={{
                  treatmentPlans: [{
                    id: 'string',
                    title: 'string',
                    status: 'active | completed',
                    procedures: [{ id: 'string', name: 'string', date: 'string', status: 'pending | scheduled | in-progress | success | failed | cancelled', notes: 'string' }]
                  }]
                }}
                response={{ success: true }}
              />
            </div>
          </div>
        </section>

        {/* Data Models */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📦 Data Models</h2>

          <div className="space-y-6">
            <ModelCard
              name="Patient"
              fields={[
                { name: 'id', type: 'string', description: 'Unique identifier (UUID)' },
                { name: 'patientId', type: 'string', description: 'Human-readable ID (e.g., PAT-001)' },
                { name: 'name', type: 'string', description: 'Full name' },
                { name: 'email', type: 'string', description: 'Email address' },
                { name: 'phone', type: 'string', description: 'Phone number' },
                { name: 'status', type: 'enum', description: 'Active | Inactive | New' },
                { name: 'dateOfBirth', type: 'date', description: 'Date of birth' },
                { name: 'gender', type: 'string', description: 'Gender' },
                { name: 'address', type: 'string', description: 'Full address' },
                { name: 'totalVisits', type: 'number', description: 'Total visit count' },
                { name: 'lastVisit', type: 'date', description: 'Last visit date' },
              ]}
            />

            <ModelCard
              name="MedicalHistory"
              fields={[
                { name: 'allergies', type: 'string[]', description: 'List of allergies' },
                { name: 'medications', type: 'string[]', description: 'Current medications' },
                { name: 'conditions', type: 'string[]', description: 'Medical conditions' },
                { name: 'bloodPressure', type: 'string', description: 'Blood pressure reading' },
                { name: 'emergencyContact', type: 'string', description: 'Emergency contact number' },
              ]}
            />

            <ModelCard
              name="BloodProfile"
              fields={[
                { name: 'bloodType', type: 'enum', description: 'A | B | AB | O' },
                { name: 'rhFactor', type: 'enum', description: 'positive | negative' },
                { name: 'verified', type: 'boolean', description: 'Lab verified status' },
                { name: 'donations', type: 'array', description: 'Blood donation records' },
                { name: 'bpReadings', type: 'array', description: 'Blood pressure readings' },
                { name: 'sugarReadings', type: 'array', description: 'Blood sugar readings' },
              ]}
            />
          </div>
        </section>

        {/* Status Codes */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 HTTP Status Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Code</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">200</span></td>
                  <td className="px-4 py-3 font-semibold">OK</td>
                  <td className="px-4 py-3 text-gray-600">Request successful</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">201</span></td>
                  <td className="px-4 py-3 font-semibold">Created</td>
                  <td className="px-4 py-3 text-gray-600">Resource created successfully</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">400</span></td>
                  <td className="px-4 py-3 font-semibold">Bad Request</td>
                  <td className="px-4 py-3 text-gray-600">Invalid request body or parameters</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">401</span></td>
                  <td className="px-4 py-3 font-semibold">Unauthorized</td>
                  <td className="px-4 py-3 text-gray-600">Authentication required</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">404</span></td>
                  <td className="px-4 py-3 font-semibold">Not Found</td>
                  <td className="px-4 py-3 text-gray-600">Resource not found</td>
                </tr>
                <tr>
                  <td className="px-4 py-3"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">500</span></td>
                  <td className="px-4 py-3 font-semibold">Server Error</td>
                  <td className="px-4 py-3 text-gray-600">Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8">
          <p>MyPatientPH API Documentation • Version 1.0</p>
          <p className="mt-1">© 2024 MyPatientPH. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}

function EndpointCard({ method, endpoint, description, body, response }: {
  method: string
  endpoint: string
  description: string
  body?: any
  response?: any
}) {
  const methodColors: Record<string, string> = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center bg-gray-50 px-4 py-3 border-b">
        <span className={`${methodColors[method]} text-white px-2 py-1 rounded text-xs font-bold mr-3`}>
          {method}
        </span>
        <code className="text-gray-800 font-mono text-sm">{endpoint}</code>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        {body && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">Request Body:</p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(body, null, 2)}
            </pre>
          </div>
        )}
        {response && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Response:</p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function ModelCard({ name, fields }: {
  name: string
  fields: { name: string; type: string; description: string }[]
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-purple-50 px-4 py-3 border-b">
        <h4 className="font-bold text-purple-800">{name}</h4>
      </div>
      <div className="p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2">Field</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fields.map((field) => (
              <tr key={field.name}>
                <td className="py-2 font-mono text-purple-600">{field.name}</td>
                <td className="py-2 text-gray-500">{field.type}</td>
                <td className="py-2 text-gray-600">{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
