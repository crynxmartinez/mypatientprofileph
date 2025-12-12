// ========== PATIENT PROFILE MAIN FUNCTIONS ==========

// View Patient Profile
async function viewPatientProfile(patient) {
    currentPatient = patient;
    document.getElementById('patient-list-view').classList.add('hidden');
    document.getElementById('patient-profile-view').classList.remove('hidden');
    
    // Set patient header
    document.getElementById('profile-patient-name').textContent = patient.name || 'Unknown Patient';
    document.getElementById('profile-patient-id').textContent = `Patient ID: ${patient.id}`;
    
    const statusColors = {
        'Active': 'bg-green-500',
        'Inactive': 'bg-red-500',
        'New': 'bg-blue-500'
    };
    document.getElementById('profile-patient-status').innerHTML = `
        <span class="px-4 py-2 rounded-full text-sm font-semibold ${statusColors[patient.status]} text-white">
            ${patient.status}
        </span>
    `;
    
    // Load ALL appointments for this patient across ALL clinics
    try {
        const allVisits = [];
        
        // Query by patientId
        const byPatientId = await db.collection('appointments')
            .where('patientId', '==', patient.id)
            .get();
        byPatientId.docs.forEach(doc => {
            allVisits.push({ id: doc.id, ...doc.data() });
        });
        
        // Query by email if available
        if (patient.email) {
            const byEmail = await db.collection('appointments')
                .where('patientEmail', '==', patient.email)
                .get();
            byEmail.docs.forEach(doc => {
                // Avoid duplicates
                if (!allVisits.find(v => v.id === doc.id)) {
                    allVisits.push({ id: doc.id, ...doc.data() });
                }
            });
        }
        
        // Sort by date descending
        allVisits.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Update currentPatient with all visits
        currentPatient.visits = allVisits;
        currentPatient.totalVisits = allVisits.length;
        
        console.log(`Loaded ${allVisits.length} visits for patient ${patient.name} across all clinics`);
    } catch (error) {
        console.error('Error loading patient visits:', error);
    }
    
    // Show overview tab by default
    showPatientTab('overview');
}

// Close Patient Profile
function closePatientProfile() {
    document.getElementById('patient-list-view').classList.remove('hidden');
    document.getElementById('patient-profile-view').classList.add('hidden');
    currentPatient = null;
}

// Show Patient Tab
async function showPatientTab(tabName) {
    // Update tab buttons - highlight the active tab
    document.querySelectorAll('.patient-tab-btn').forEach(btn => {
        btn.classList.remove('border-purple-600', 'text-purple-600');
        btn.classList.add('border-transparent', 'text-gray-500');
        // Find the button that matches the tabName and highlight it
        if (btn.getAttribute('onclick')?.includes(`'${tabName}'`)) {
            btn.classList.remove('border-transparent', 'text-gray-500');
            btn.classList.add('border-purple-600', 'text-purple-600');
        }
    });
    
    const content = document.getElementById('patient-tab-content');
    
    // Call the appropriate tab render function
    switch(tabName) {
        case 'overview':
            renderOverviewTab(content);
            break;
        case 'visits':
            renderVisitsTab(content);
            break;
        case 'activity':
            renderActivityTab(content);
            break;
        case 'medical':
            renderMedicalTab(content);
            break;
        case 'blood':
            renderBloodTab(content);
            break;
        case 'dental':
            renderDentalTab(content);
            break;
        case 'files':
            renderFilesTab(content);
            break;
        case 'treatment':
            renderTreatmentTab(content);
            break;
        case 'forms':
            renderFormsTab(content);
            break;
        default:
            content.innerHTML = '<p class="text-gray-500">Tab not found</p>';
    }
}

// ========== OVERVIEW TAB ==========
function renderOverviewTab(content) {
    content.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Contact Information</h3>
                <div class="space-y-3">
                    <div><span class="text-gray-600">Email:</span> <span class="font-semibold">${currentPatient.email || 'N/A'}</span></div>
                    <div><span class="text-gray-600">Phone:</span> <span class="font-semibold">${currentPatient.phone || 'N/A'}</span></div>
                    <div><span class="text-gray-600">Patient ID:</span> <span class="font-semibold">${currentPatient.id}</span></div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Visit Summary</h3>
                <div class="space-y-3">
                    <div><span class="text-gray-600">Total Visits:</span> <span class="font-semibold">${currentPatient.totalVisits || 0}</span></div>
                    <div><span class="text-gray-600">Last Visit:</span> <span class="font-semibold">${currentPatient.lastVisit || 'N/A'}</span></div>
                    <div><span class="text-gray-600">Status:</span> <span class="font-semibold">${currentPatient.status}</span></div>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Recent Visits</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${currentPatient.visits && currentPatient.visits.length > 0 ? currentPatient.visits.slice(0, 5).map(visit => `
                            <tr>
                                <td class="px-4 py-3 text-sm">${visit.date}</td>
                                <td class="px-4 py-3 text-sm">${visit.doctorName || 'N/A'}</td>
                                <td class="px-4 py-3 text-sm">${visit.serviceName || visit.service || visit.patientService || 'N/A'}</td>
                                <td class="px-4 py-3 text-sm"><span class="px-2 py-1 rounded-full text-xs ${getStatusColor(visit.status)}">${visit.status}</span></td>
                            </tr>
                        `).join('') : '<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No visits yet</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ========== VISITS TAB ==========
function renderVisitsTab(content) {
    content.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Complete Visit History (All Clinics)</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clinic</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${currentPatient.visits && currentPatient.visits.length > 0 ? currentPatient.visits.map(visit => `
                            <tr>
                                <td class="px-4 py-3 text-sm">${visit.date}</td>
                                <td class="px-4 py-3 text-sm">${formatTime12h(visit.startTime) || 'N/A'}</td>
                                <td class="px-4 py-3 text-sm"><span class="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">${visit.clinicName || visit.branch || visit.clinicId || 'N/A'}</span></td>
                                <td class="px-4 py-3 text-sm">${visit.doctorName || 'N/A'}</td>
                                <td class="px-4 py-3 text-sm">${visit.serviceName || visit.service || visit.patientService || 'N/A'}</td>
                                <td class="px-4 py-3 text-sm"><span class="px-2 py-1 rounded-full text-xs ${getStatusColor(visit.status)}">${visit.status}</span></td>
                            </tr>
                        `).join('') : '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No visit history found</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Patient Search Functions
function searchPatients() {
    const searchTerm = document.getElementById('patient-search').value.toLowerCase();
    filterAndDisplayPatients(searchTerm);
}

function filterPatients() {
    const searchTerm = document.getElementById('patient-search').value.toLowerCase();
    filterAndDisplayPatients(searchTerm);
}

function clearPatientFilters() {
    document.getElementById('patient-search').value = '';
    document.getElementById('patient-filter-status').value = '';
    filterAndDisplayPatients('');
}

function filterAndDisplayPatients(searchTerm) {
    const statusFilter = document.getElementById('patient-filter-status').value.toLowerCase();
    
    const filtered = allPatients.filter(patient => {
        const matchesSearch = !searchTerm || 
            patient.name?.toLowerCase().includes(searchTerm) ||
            patient.email?.toLowerCase().includes(searchTerm) ||
            patient.phone?.includes(searchTerm);
        
        const matchesStatus = !statusFilter || patient.status?.toLowerCase() === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    renderPatientsTable(filtered);
}

function renderPatientsTable(patients) {
    const tbody = document.getElementById('patients-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = patients.map(patient => `
        <tr class="hover:bg-gray-50 cursor-pointer">
            <td class="px-6 py-4 text-sm text-gray-600">${patient.id}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-800">${patient.name}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
                <div>${patient.email || 'N/A'}</div>
                <div class="text-xs text-gray-400">${patient.phone || 'N/A'}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">${patient.totalVisits || 0}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${patient.lastVisit || 'N/A'}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}">${patient.status}</span>
            </td>
            <td class="px-6 py-4">
                <button onclick='viewPatientProfile(${JSON.stringify(patient)})' class="text-purple-600 hover:text-purple-800 font-semibold text-sm">
                    <i class="fas fa-eye mr-1"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}
