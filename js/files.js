// ========== FILES & IMAGES TAB ==========

function renderFilesTab(content) {
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center"><i class="fas fa-x-ray mr-2 text-blue-600"></i>🔬 X-Rays</h3>
                    <button onclick="uploadFile('xray')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"><i class="fas fa-upload mr-2"></i>Upload X-Ray</button>
                </div>
                <div id="xrays-grid" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div onclick="uploadFile('xray')" class="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition">
                        <i class="fas fa-plus text-3xl mb-2"></i>
                        <span class="text-sm">Upload X-Ray</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center"><i class="fas fa-camera mr-2 text-green-600"></i>📷 Intraoral Photos</h3>
                    <button onclick="uploadFile('photo')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"><i class="fas fa-upload mr-2"></i>Upload Photo</button>
                </div>
                <div id="photos-grid" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div onclick="uploadFile('photo')" class="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-500 cursor-pointer transition">
                        <i class="fas fa-plus text-3xl mb-2"></i>
                        <span class="text-sm">Upload Photo</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center"><i class="fas fa-file-pdf mr-2 text-red-600"></i>📄 Documents</h3>
                    <button onclick="uploadFile('document')" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"><i class="fas fa-upload mr-2"></i>Upload Document</button>
                </div>
                <div id="documents-list" class="space-y-2">
                    <div class="text-sm text-gray-500 italic">No documents uploaded yet</div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center"><i class="fas fa-id-card mr-2 text-purple-600"></i>💳 Insurance Cards</h3>
                    <button onclick="uploadFile('insurance')" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"><i class="fas fa-upload mr-2"></i>Upload Card</button>
                </div>
                <div id="insurance-grid" class="grid grid-cols-2 gap-4">
                    <div onclick="uploadFile('insurance')" class="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 cursor-pointer transition">
                        <i class="fas fa-plus text-3xl mb-2"></i>
                        <span class="text-sm">Front</span>
                    </div>
                    <div onclick="uploadFile('insurance')" class="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 cursor-pointer transition">
                        <i class="fas fa-plus text-3xl mb-2"></i>
                        <span class="text-sm">Back</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// File Upload Functions (Placeholder - requires Firebase Storage)
function uploadFile(fileType) {
    showToast(`📁 File upload requires Firebase Storage setup. File type: ${fileType}`, 'info');
    
    // Example implementation with Firebase Storage:
    /*
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fileType === 'document' ? '.pdf,.doc,.docx' : 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        
        try {
            // Upload to Firebase Storage
            const storageRef = firebase.storage().ref();
            const fileRef = storageRef.child(`patients/${patientId}/${fileType}/${Date.now()}_${file.name}`);
            
            showToast('📤 Uploading file...', 'info');
            
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            // Save file reference to Firestore
            const fileData = {
                id: `file-${Date.now()}`,
                name: file.name,
                url: downloadURL,
                type: fileType,
                uploadedAt: new Date().toISOString()
            };
            
            await db.collection('patients').doc(patientId).update({
                [`files.${fileType}s`]: firebase.firestore.FieldValue.arrayUnion(fileData)
            });
            
            // Log the change
            await logPatientChange(patientId, {
                action: 'Uploaded File',
                category: 'files',
                details: `${fileType}: ${file.name}`,
                newValue: file.name
            });
            
            showToast(`✅ ${file.name} uploaded successfully!`, 'success');
            showPatientTab('files');
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('❌ Error uploading file', 'error');
        }
    };
    
    input.click();
    */
}

// View File
function viewFile(url, name) {
    window.open(url, '_blank');
}

// Delete File
function deleteFile(fileType, fileId) {
    showConfirmModal('Delete File', 'Are you sure you want to delete this file?', async () => {
        const patientId = currentPatient?.firestoreId;
        if (!patientId) return;
        
        try {
            // Find and remove the file
            const files = currentPatient.files?.[`${fileType}s`] || [];
            const file = files.find(f => f.id === fileId);
            if (!file) return;
            
            // Remove from Firestore
            await db.collection('patients').doc(patientId).update({
                [`files.${fileType}s`]: firebase.firestore.FieldValue.arrayRemove(file)
            });
            
            // Log the change
            await logPatientChange(patientId, {
                action: 'Deleted File',
                category: 'files',
                details: `${fileType}: ${file.name}`,
                previousValue: file.name
            });
            
            // Update local state
            currentPatient.files[`${fileType}s`] = files.filter(f => f.id !== fileId);
            
            showToast('🗑️ File deleted', 'success');
            showPatientTab('files');
        } catch (error) {
            console.error('Error deleting file:', error);
            showToast('❌ Error deleting file', 'error');
        }
    }, 'Delete', 'red');
}
