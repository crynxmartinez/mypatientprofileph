// ========== UTILITY FUNCTIONS ==========

// Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg mb-2 transform transition-all duration-300 flex items-center`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format time to 12-hour format
function formatTime12h(time) {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Get status color class
function getStatusColor(status) {
    const colors = {
        'Confirmed': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Cancelled': 'bg-red-100 text-red-800',
        'Completed': 'bg-blue-100 text-blue-800',
        'No Show': 'bg-gray-100 text-gray-800',
        'Active': 'bg-green-100 text-green-800',
        'Inactive': 'bg-red-100 text-red-800',
        'New': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// Modern Modal Input (replaces browser prompt)
function showInputModal(title, placeholder, buttonText, callback) {
    // Remove focus from any currently focused element
    if (document.activeElement) document.activeElement.blur();
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.id = 'input-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h3 class="text-xl font-bold text-white">${title}</h3>
            </div>
            <div class="p-6">
                <input type="text" id="modal-input-value" placeholder="${placeholder}" 
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none text-gray-700">
                <div class="flex space-x-3 mt-6">
                    <button id="modal-submit-btn" onclick="submitModalInput()" class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-lg">
                        <i class="fas fa-check mr-2"></i>${buttonText}
                    </button>
                    <button id="modal-cancel-btn" onclick="closeInputModal()" class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all font-semibold">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => {
        const input = document.getElementById('modal-input-value');
        if (input) input.focus();
    }, 50);
    window.modalInputCallback = callback;
    document.getElementById('modal-input-value').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitModalInput();
    });
}

async function submitModalInput() {
    const value = document.getElementById('modal-input-value').value.trim();
    if (!value) {
        closeInputModal();
        return;
    }
    
    // Show loading state
    const btn = document.getElementById('modal-submit-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    btn.disabled = true;
    cancelBtn.disabled = true;
    
    const callback = window.modalInputCallback;
    try {
        if (callback) await callback(value);
    } finally {
        closeInputModal();
    }
}

function closeInputModal() {
    const modal = document.getElementById('input-modal');
    if (modal) modal.remove();
    window.modalInputCallback = null;
}

// Confirm Modal
function showConfirmModal(title, message, callback, confirmText = 'Confirm', color = 'purple') {
    const colorClasses = {
        purple: 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
        red: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
        green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
        yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
    };
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.id = 'confirm-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div class="bg-gradient-to-r ${colorClasses[color]} px-6 py-4">
                <h3 class="text-xl font-bold text-white">${title}</h3>
            </div>
            <div class="p-6">
                <p class="text-gray-700 mb-6">${message}</p>
                <div class="flex space-x-3">
                    <button id="confirm-btn" class="flex-1 bg-gradient-to-r ${colorClasses[color]} text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg">
                        <i class="fas fa-check mr-2"></i>${confirmText}
                    </button>
                    <button onclick="closeConfirmModal()" class="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all font-semibold">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirm-btn').addEventListener('click', async () => {
        const btn = document.getElementById('confirm-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        btn.disabled = true;
        try {
            if (callback) await callback();
        } finally {
            closeConfirmModal();
        }
    });
}

function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.remove();
}

// Helper: Ensure patient exists in Firestore
async function ensurePatientInFirestore() {
    if (!currentPatient) {
        showToast('❌ No patient selected', 'error');
        return null;
    }
    if (currentPatient.firestoreId) return currentPatient.firestoreId;
    
    try {
        // Try to find existing patient by phone or email first
        let existingPatient = null;
        
        if (currentPatient.phone) {
            const phoneQuery = await db.collection('patients').where('phone', '==', currentPatient.phone).limit(1).get();
            if (!phoneQuery.empty) existingPatient = phoneQuery.docs[0];
        }
        
        if (!existingPatient && currentPatient.email) {
            const emailQuery = await db.collection('patients').where('email', '==', currentPatient.email).limit(1).get();
            if (!emailQuery.empty) existingPatient = emailQuery.docs[0];
        }
        
        if (existingPatient) {
            currentPatient.firestoreId = existingPatient.id;
            const data = existingPatient.data();
            currentPatient.medicalHistory = data.medicalHistory || {};
            currentPatient.bloodProfile = data.bloodProfile || {};
            currentPatient.dentalChart = data.dentalChart || {};
            currentPatient.treatmentPlans = data.treatmentPlans || [];
            currentPatient.files = data.files || {};
            
            const idx = allPatients.findIndex(p => p.id === currentPatient.id);
            if (idx !== -1) allPatients[idx].firestoreId = existingPatient.id;
            
            console.log('✅ Found existing patient in Firestore:', existingPatient.id);
            return existingPatient.id;
        }
        
        // Create new patient record
        const newPatientRef = await db.collection('patients').add({
            name: currentPatient.name,
            email: currentPatient.email,
            phone: currentPatient.phone,
            medicalHistory: {},
            bloodProfile: {},
            dentalChart: { teeth: {} },
            treatmentPlans: [],
            files: { xrays: [], photos: [], documents: [], insurance: [] },
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        currentPatient.firestoreId = newPatientRef.id;
        const idx = allPatients.findIndex(p => p.id === currentPatient.id);
        if (idx !== -1) allPatients[idx].firestoreId = newPatientRef.id;
        
        console.log('✅ Created new patient in Firestore:', newPatientRef.id);
        return newPatientRef.id;
    } catch (error) {
        console.error('Error creating patient:', error);
        showToast('❌ Error creating patient record', 'error');
        return null;
    }
}

// Log patient changes for activity tracking
async function logPatientChange(patientId, changeData) {
    try {
        await db.collection('patientLogs').add({
            patientId: patientId,
            ...changeData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            performedBy: 'Doctor' // Replace with actual user info
        });
    } catch (error) {
        console.error('Error logging patient change:', error);
    }
}
