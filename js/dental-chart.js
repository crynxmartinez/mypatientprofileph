// ========== DENTAL CHART TAB ==========

let selectedToothNumber = null;

function renderDentalTab(content) {
    const teeth = currentPatient?.dentalChart?.teeth || {};
    
    const getToothColor = (toothNum) => {
        const condition = teeth[toothNum]?.condition || '';
        const colors = {
            '': { icon: 'text-gray-400', border: 'border-gray-300', bg: 'bg-white' },
            'missing': { icon: 'text-red-500', border: 'border-red-400', bg: 'bg-red-50' },
            'cavity': { icon: 'text-yellow-500', border: 'border-yellow-400', bg: 'bg-yellow-50' },
            'filling': { icon: 'text-blue-500', border: 'border-blue-400', bg: 'bg-blue-50' },
            'crown': { icon: 'text-purple-500', border: 'border-purple-400', bg: 'bg-purple-50' },
            'root-canal': { icon: 'text-green-500', border: 'border-green-400', bg: 'bg-green-50' },
            'implant': { icon: 'text-gray-600', border: 'border-gray-500', bg: 'bg-gray-100' },
            'bridge': { icon: 'text-orange-500', border: 'border-orange-400', bg: 'bg-orange-50' },
            'attention': { icon: 'text-pink-500', border: 'border-pink-400', bg: 'bg-pink-50' }
        };
        return colors[condition] || colors[''];
    };
    
    const renderTooth = (toothNum) => {
        const color = getToothColor(toothNum);
        const hasData = teeth[toothNum]?.condition;
        return `
            <button onclick="selectTooth(${toothNum})" class="tooth-btn w-12 h-16 ${color.bg} border-2 ${color.border} rounded-lg hover:border-purple-500 hover:shadow-md transition flex flex-col items-center justify-center text-xs font-semibold relative">
                <i class="fas fa-tooth text-2xl ${color.icon} mb-1"></i>
                <span class="text-gray-600">${toothNum}</span>
                ${hasData ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>' : ''}
            </button>
        `;
    };
    
    content.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">🦷 Interactive Dental Chart</h3>
            
            <div class="mb-8">
                <h4 class="text-lg font-semibold text-gray-700 mb-4 text-center">Upper Teeth</h4>
                <div class="flex justify-center space-x-1 md:space-x-2 mb-2 flex-wrap">
                    ${[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28].map(tooth => renderTooth(tooth)).join('')}
                </div>
                
                <h4 class="text-lg font-semibold text-gray-700 mb-4 mt-8 text-center">Lower Teeth</h4>
                <div class="flex justify-center space-x-1 md:space-x-2 flex-wrap">
                    ${[48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38].map(tooth => renderTooth(tooth)).join('')}
                </div>
            </div>
            
            <!-- Legend -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 class="font-bold text-gray-800 mb-3">Legend:</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-gray-400"></i><span>Healthy</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-red-500"></i><span>Missing</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-yellow-500"></i><span>Cavity</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-blue-500"></i><span>Filling</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-purple-500"></i><span>Crown</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-green-500"></i><span>Root Canal</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-gray-600"></i><span>Implant</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-orange-500"></i><span>Bridge</span></div>
                    <div class="flex items-center space-x-2"><i class="fas fa-tooth text-pink-500"></i><span>Needs Attention</span></div>
                </div>
            </div>
            
            <!-- Tooth Details Panel -->
            <div id="tooth-details" class="bg-blue-50 border border-blue-200 rounded-lg p-4 hidden">
                <h4 class="font-bold text-blue-800 mb-3">Tooth #<span id="selected-tooth-number"></span> Details</h4>
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                        <select id="tooth-condition" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">Healthy</option>
                            <option value="missing">Missing</option>
                            <option value="cavity">Cavity</option>
                            <option value="filling">Filling</option>
                            <option value="crown">Crown</option>
                            <option value="root-canal">Root Canal</option>
                            <option value="implant">Implant</option>
                            <option value="bridge">Bridge</option>
                            <option value="attention">Needs Attention</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                        <textarea id="tooth-notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Add notes about this tooth..."></textarea>
                    </div>
                    <div class="flex space-x-2">
                        <button id="btn-save-tooth" onclick="saveToothData()" class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold"><i class="fas fa-save mr-2"></i>Save</button>
                        <button onclick="closeToothDetails()" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Select Tooth
function selectTooth(toothNumber) {
    selectedToothNumber = toothNumber;
    document.getElementById('selected-tooth-number').textContent = toothNumber;
    document.getElementById('tooth-details').classList.remove('hidden');
    const toothData = currentPatient?.dentalChart?.teeth?.[toothNumber];
    if (toothData) {
        document.getElementById('tooth-condition').value = toothData.condition || '';
        document.getElementById('tooth-notes').value = toothData.notes || '';
    } else {
        document.getElementById('tooth-condition').value = '';
        document.getElementById('tooth-notes').value = '';
    }
}

// Save Tooth Data
async function saveToothData() {
    const condition = document.getElementById('tooth-condition').value;
    const notes = document.getElementById('tooth-notes').value;
    
    // Show loading
    const btn = document.getElementById('btn-save-tooth');
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
        const previousCondition = currentPatient?.dentalChart?.teeth?.[selectedToothNumber]?.condition;
        await db.collection('patients').doc(patientId).update({
            [`dentalChart.teeth.${selectedToothNumber}`]: { condition, notes, updatedAt: new Date().toISOString() },
            'dentalChart.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Updated Dental Chart',
            category: 'dental_chart',
            details: `Tooth #${selectedToothNumber}: ${condition || 'No condition'}${notes ? ' - ' + notes : ''}`,
            previousValue: previousCondition,
            newValue: condition
        });
        if (!currentPatient.dentalChart) currentPatient.dentalChart = { teeth: {} };
        if (!currentPatient.dentalChart.teeth) currentPatient.dentalChart.teeth = {};
        currentPatient.dentalChart.teeth[selectedToothNumber] = { condition, notes };
        showToast(`✅ Saved data for tooth #${selectedToothNumber}`, 'success');
        // Refresh dental chart to show updated colors
        showPatientTab('dental');
    } catch (error) {
        console.error('Error saving tooth data:', error);
        showToast('❌ Error saving tooth data', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Close Tooth Details
function closeToothDetails() {
    document.getElementById('tooth-details').classList.add('hidden');
    document.getElementById('tooth-condition').value = '';
    document.getElementById('tooth-notes').value = '';
    selectedToothNumber = null;
}
