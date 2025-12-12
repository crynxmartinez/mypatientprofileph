// ========== MEDICAL HISTORY TAB ==========

function renderMedicalTab(content) {
    const allergies = currentPatient.medicalHistory?.allergies || [];
    const medications = currentPatient.medicalHistory?.medications || [];
    const conditions = currentPatient.medicalHistory?.conditions || [];
    const bloodType = currentPatient.medicalHistory?.bloodType || '';
    const bloodPressure = currentPatient.medicalHistory?.bloodPressure || '';
    const emergencyContact = currentPatient.medicalHistory?.emergencyContact || '';
    
    content.innerHTML = `
        <div class="space-y-6">
            ${allergies.length === 0 && medications.length === 0 ? `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div class="flex items-start">
                    <i class="fas fa-exclamation-triangle text-yellow-600 text-xl mr-3 mt-1"></i>
                    <div class="flex-1">
                        <h4 class="font-bold text-yellow-800 mb-2">⚠️ Incomplete Medical Profile</h4>
                        <p class="text-sm text-yellow-700 mb-3">Critical information is missing. Send a form to the patient to complete their medical history.</p>
                        <button onclick="sendMedicalForm('${currentPatient.phone || currentPatient.email}')" class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm font-semibold">
                            <i class="fas fa-paper-plane mr-2"></i>Send Medical History Form
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-red-600 flex items-center"><i class="fas fa-allergies mr-2"></i>⚠️ ALLERGIES (${allergies.length})</h3>
                    <button onclick="addAllergy()" class="text-red-600 hover:text-red-700 text-sm font-semibold"><i class="fas fa-plus mr-1"></i>Add</button>
                </div>
                <div id="allergies-list" class="space-y-2">
                    ${allergies.length > 0 ? allergies.map(a => `
                        <div class="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                            <span class="text-sm text-red-800 font-semibold">⚠️ ${a}</span>
                            <button onclick="removeAllergy('${a}')" class="text-red-600 hover:text-red-800"><i class="fas fa-times"></i></button>
                        </div>
                    `).join('') : `
                        <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                            <i class="fas fa-info-circle mr-2"></i>No allergies recorded.
                        </div>
                    `}
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center"><i class="fas fa-pills mr-2 text-blue-600"></i>💊 Current Medications (${medications.length})</h3>
                    <button onclick="addMedication()" class="text-blue-600 hover:text-blue-700 text-sm font-semibold"><i class="fas fa-plus mr-1"></i>Add</button>
                </div>
                <div id="medications-list" class="space-y-2">
                    ${medications.length > 0 ? medications.map(m => `
                        <div class="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <span class="text-sm text-blue-800">💊 ${m}</span>
                            <button onclick="removeMedication('${m}')" class="text-blue-600 hover:text-blue-800"><i class="fas fa-times"></i></button>
                        </div>
                    `).join('') : `
                        <div class="text-sm text-gray-500 italic">No medications recorded</div>
                    `}
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-hospital mr-2 text-green-600"></i>🏥 Medical Conditions</h3>
                <div id="medical-conditions-list" class="grid md:grid-cols-2 gap-3">
                    <label class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" value="Diabetes" class="form-checkbox text-purple-600" ${conditions.includes('Diabetes') ? 'checked' : ''}>
                        <span class="text-sm">Diabetes</span>
                    </label>
                    <label class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" value="High Blood Pressure" class="form-checkbox text-purple-600" ${conditions.includes('High Blood Pressure') ? 'checked' : ''}>
                        <span class="text-sm">High Blood Pressure</span>
                    </label>
                    <label class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" value="Heart Disease" class="form-checkbox text-purple-600" ${conditions.includes('Heart Disease') ? 'checked' : ''}>
                        <span class="text-sm">Heart Disease</span>
                    </label>
                    <label class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" value="Asthma" class="form-checkbox text-purple-600" ${conditions.includes('Asthma') ? 'checked' : ''}>
                        <span class="text-sm">Asthma</span>
                    </label>
                    <label class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" value="Pregnancy" class="form-checkbox text-purple-600" ${conditions.includes('Pregnancy') ? 'checked' : ''}>
                        <span class="text-sm">Pregnancy</span>
                    </label>
                    <label class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                        <input type="checkbox" value="Bleeding Disorder" class="form-checkbox text-purple-600" ${conditions.includes('Bleeding Disorder') ? 'checked' : ''}>
                        <span class="text-sm">Bleeding Disorder</span>
                    </label>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-heartbeat mr-2 text-purple-600"></i>Vital Information</h3>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Blood Pressure</label>
                        <input type="text" id="vital-blood-pressure" value="${bloodPressure}" placeholder="120/80" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                        <input type="text" id="vital-emergency-contact" value="${emergencyContact}" placeholder="09123456789" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end">
                <button id="btn-save-medical" onclick="saveMedicalHistory()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                    <i class="fas fa-save mr-2"></i>Save Medical History
                </button>
            </div>
        </div>
    `;
}

// Send Medical Form
function sendMedicalForm(contact) {
    const formId = Math.random().toString(36).substr(2, 9);
    const formLink = `https://your-domain.com/form/?type=medical&id=${formId}&contact=${encodeURIComponent(contact)}`;
    showToast(`📤 Form link generated: ${formLink}`, 'success');
}

// Add Allergy
function addAllergy() {
    showInputModal('⚠️ Add Allergy', 'Enter allergy name (e.g., Penicillin, Peanuts)', 'Add Allergy', async (allergy) => {
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        try {
            await db.collection('patients').doc(patientId).update({
                'medicalHistory.allergies': firebase.firestore.FieldValue.arrayUnion(allergy),
                'medicalHistory.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
            });
            // Log the change
            await logPatientChange(patientId, {
                action: 'Added Allergy',
                category: 'medical_history',
                details: allergy,
                newValue: allergy
            });
            // Update local state
            if (!currentPatient.medicalHistory) currentPatient.medicalHistory = {};
            if (!currentPatient.medicalHistory.allergies) currentPatient.medicalHistory.allergies = [];
            currentPatient.medicalHistory.allergies.push(allergy);
            showPatientTab('medical');
            showToast(`✅ Added allergy: ${allergy}`, 'success');
        } catch (error) {
            console.error('Error adding allergy:', error);
            showToast('❌ Error adding allergy', 'error');
        }
    });
}

// Remove Allergy
async function removeAllergy(allergy) {
    const patientId = currentPatient?.firestoreId;
    if (!patientId) return;
    try {
        await db.collection('patients').doc(patientId).update({
            'medicalHistory.allergies': firebase.firestore.FieldValue.arrayRemove(allergy)
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Removed Allergy',
            category: 'medical_history',
            details: allergy,
            previousValue: allergy
        });
        currentPatient.medicalHistory.allergies = currentPatient.medicalHistory.allergies.filter(a => a !== allergy);
        showPatientTab('medical');
        showToast(`🗑️ Removed allergy: ${allergy}`, 'success');
    } catch (error) {
        showToast('❌ Error removing allergy', 'error');
    }
}

// Add Medication
function addMedication() {
    showInputModal('💊 Add Medication', 'Enter medication name and dosage (e.g., Metformin 500mg)', 'Add Medication', async (medication) => {
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        try {
            await db.collection('patients').doc(patientId).update({
                'medicalHistory.medications': firebase.firestore.FieldValue.arrayUnion(medication),
                'medicalHistory.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
            });
            // Log the change
            await logPatientChange(patientId, {
                action: 'Added Medication',
                category: 'medical_history',
                details: medication,
                newValue: medication
            });
            // Update local state
            if (!currentPatient.medicalHistory) currentPatient.medicalHistory = {};
            if (!currentPatient.medicalHistory.medications) currentPatient.medicalHistory.medications = [];
            currentPatient.medicalHistory.medications.push(medication);
            showPatientTab('medical');
            showToast(`✅ Added medication: ${medication}`, 'success');
        } catch (error) {
            console.error('Error adding medication:', error);
            showToast('❌ Error adding medication', 'error');
        }
    });
}

// Remove Medication
async function removeMedication(medication) {
    const patientId = currentPatient?.firestoreId;
    if (!patientId) return;
    try {
        await db.collection('patients').doc(patientId).update({
            'medicalHistory.medications': firebase.firestore.FieldValue.arrayRemove(medication)
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Removed Medication',
            category: 'medical_history',
            details: medication,
            previousValue: medication
        });
        currentPatient.medicalHistory.medications = currentPatient.medicalHistory.medications.filter(m => m !== medication);
        showPatientTab('medical');
        showToast(`🗑️ Removed medication: ${medication}`, 'success');
    } catch (error) {
        showToast('❌ Error removing medication', 'error');
    }
}

// Save Medical History
async function saveMedicalHistory() {
    const btn = document.getElementById('btn-save-medical');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    btn.disabled = true;
    
    const patientId = await ensurePatientInFirestore();
    if (!patientId) {
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }
    try {
        const conditions = [];
        document.querySelectorAll('#medical-conditions-list input[type="checkbox"]:checked').forEach(cb => conditions.push(cb.value));
        const bloodPressure = document.getElementById('vital-blood-pressure')?.value || '';
        const emergencyContact = document.getElementById('vital-emergency-contact')?.value || '';
        
        await db.collection('patients').doc(patientId).update({
            'medicalHistory.conditions': conditions,
            'medicalHistory.bloodPressure': bloodPressure,
            'medicalHistory.emergencyContact': emergencyContact,
            'medicalHistory.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Log the change
        await logPatientChange(patientId, {
            action: 'Updated Medical History',
            category: 'medical_history',
            details: `Conditions: ${conditions.length}, BP: ${bloodPressure || 'N/A'}, Emergency: ${emergencyContact || 'N/A'}`
        });
        
        // Update local currentPatient object
        if (!currentPatient.medicalHistory) currentPatient.medicalHistory = {};
        currentPatient.medicalHistory.conditions = conditions;
        currentPatient.medicalHistory.bloodPressure = bloodPressure;
        currentPatient.medicalHistory.emergencyContact = emergencyContact;
        
        showToast('💾 Medical history saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving medical history:', error);
        showToast('❌ Error saving medical history', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
