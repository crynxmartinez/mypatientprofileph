// ========== ACTIVITY LOG TAB ==========

let allActivityLogs = [];

function renderActivityTab(content) {
    content.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800 flex items-center">
                    <i class="fas fa-history text-purple-600 mr-2"></i>Activity Log
                </h3>
                <select id="activity-filter" onchange="filterActivityLogs()" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="all">All Activities</option>
                    <option value="medical_history">Medical History</option>
                    <option value="dental_chart">Dental Chart</option>
                    <option value="treatment_plan">Treatment Plans</option>
                    <option value="blood_profile">Blood Profile</option>
                    <option value="files">Files</option>
                </select>
            </div>
            <div id="activity-log-list" class="space-y-3">
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                    <p>Loading activity log...</p>
                </div>
            </div>
        </div>
    `;
    // Load activity logs
    loadPatientActivityLogs();
}

// Load Patient Activity Logs
async function loadPatientActivityLogs() {
    const listContainer = document.getElementById('activity-log-list');
    if (!listContainer) return;
    
    try {
        const patientId = currentPatient?.firestoreId;
        if (!patientId) {
            listContainer.innerHTML = '<div class="text-sm text-gray-500 italic text-center py-8">No activity logs available</div>';
            return;
        }
        
        const logsSnapshot = await db.collection('patientLogs')
            .where('patientId', '==', patientId)
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();
        
        allActivityLogs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        renderActivityLogs(allActivityLogs);
    } catch (error) {
        console.error('Error loading activity logs:', error);
        listContainer.innerHTML = '<div class="text-sm text-red-500 italic text-center py-8">Error loading activity logs</div>';
    }
}

// Render Activity Logs
function renderActivityLogs(logs) {
    const listContainer = document.getElementById('activity-log-list');
    if (!listContainer) return;
    
    if (logs.length === 0) {
        listContainer.innerHTML = '<div class="text-sm text-gray-500 italic text-center py-8">No activity logs found</div>';
        return;
    }
    
    const getCategoryIcon = (category) => {
        const icons = {
            'medical_history': '<i class="fas fa-heartbeat text-red-500"></i>',
            'dental_chart': '<i class="fas fa-tooth text-blue-500"></i>',
            'treatment_plan': '<i class="fas fa-procedures text-green-500"></i>',
            'blood_profile': '<i class="fas fa-tint text-pink-500"></i>',
            'files': '<i class="fas fa-file text-purple-500"></i>'
        };
        return icons[category] || '<i class="fas fa-circle text-gray-400"></i>';
    };
    
    const getCategoryColor = (category) => {
        const colors = {
            'medical_history': 'border-red-200 bg-red-50',
            'dental_chart': 'border-blue-200 bg-blue-50',
            'treatment_plan': 'border-green-200 bg-green-50',
            'blood_profile': 'border-pink-200 bg-pink-50',
            'files': 'border-purple-200 bg-purple-50'
        };
        return colors[category] || 'border-gray-200 bg-gray-50';
    };
    
    listContainer.innerHTML = logs.map(log => {
        const timestamp = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
        const timeAgo = getTimeAgo(timestamp);
        
        return `
            <div class="flex items-start space-x-3 p-3 border ${getCategoryColor(log.category)} rounded-lg">
                <div class="flex-shrink-0 mt-1">
                    ${getCategoryIcon(log.category)}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800">${log.action}</p>
                    <p class="text-xs text-gray-600">${log.details || ''}</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="text-xs text-gray-400">${timeAgo}</span>
                        ${log.performedBy ? `<span class="text-xs text-gray-400">• by ${log.performedBy}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter Activity Logs
function filterActivityLogs() {
    const filter = document.getElementById('activity-filter').value;
    
    if (filter === 'all') {
        renderActivityLogs(allActivityLogs);
    } else {
        const filtered = allActivityLogs.filter(log => log.category === filter);
        renderActivityLogs(filtered);
    }
}

// Get Time Ago Helper
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
}
