'use client'

import { useState } from 'react'
import { Upload, FileText, Camera, Image, CreditCard } from 'lucide-react'

interface FilesTabProps {
  patient: any
}

export default function FilesTab({ patient }: FilesTabProps) {
  const files = patient.files || []
  
  const xrays = files.filter((f: any) => f.fileType === 'xray')
  const photos = files.filter((f: any) => f.fileType === 'photo')
  const documents = files.filter((f: any) => f.fileType === 'document')
  const insurance = files.filter((f: any) => f.fileType === 'insurance')

  const handleUpload = (fileType: string) => {
    alert(`File upload for ${fileType} - This feature requires cloud storage setup (e.g., AWS S3, Cloudinary)`)
  }

  return (
    <div className="space-y-6">
      {/* X-Rays */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Image className="w-5 h-5 mr-2 text-blue-600" />
            🔬 X-Rays ({xrays.length})
          </h3>
          <button
            onClick={() => handleUpload('xray')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload X-Ray
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {xrays.length > 0 ? (
            xrays.map((file: any) => (
              <div
                key={file.id}
                className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition cursor-pointer"
              >
                <div className="bg-gray-100 rounded h-24 flex items-center justify-center mb-2">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 truncate">{file.fileName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div
              onClick={() => handleUpload('xray')}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition col-span-2 md:col-span-4"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm">Upload X-Ray</span>
            </div>
          )}
        </div>
      </div>

      {/* Intraoral Photos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-green-600" />
            📷 Intraoral Photos ({photos.length})
          </h3>
          <button
            onClick={() => handleUpload('photo')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photo
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.length > 0 ? (
            photos.map((file: any) => (
              <div
                key={file.id}
                className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition cursor-pointer"
              >
                <div className="bg-gray-100 rounded h-24 flex items-center justify-center mb-2">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 truncate">{file.fileName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div
              onClick={() => handleUpload('photo')}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 cursor-pointer transition col-span-2 md:col-span-4"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm">Upload Photo</span>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-red-600" />
            📄 Documents ({documents.length})
          </h3>
          <button
            onClick={() => handleUpload('document')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </button>
        </div>
        <div className="space-y-2">
          {documents.length > 0 ? (
            documents.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{file.fileName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No documents uploaded yet</div>
          )}
        </div>
      </div>

      {/* Insurance Cards */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
            💳 Insurance Cards ({insurance.length})
          </h3>
          <button
            onClick={() => handleUpload('insurance')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Card
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {insurance.length > 0 ? (
            insurance.map((file: any) => (
              <div
                key={file.id}
                className="border border-gray-200 rounded-lg p-2 hover:shadow-md transition cursor-pointer"
              >
                <div className="bg-gray-100 rounded h-24 flex items-center justify-center mb-2">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 truncate">{file.fileName}</p>
              </div>
            ))
          ) : (
            <>
              <div
                onClick={() => handleUpload('insurance')}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 cursor-pointer transition"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">Front</span>
              </div>
              <div
                onClick={() => handleUpload('insurance')}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 cursor-pointer transition"
              >
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm">Back</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
