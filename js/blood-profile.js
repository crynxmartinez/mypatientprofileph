// ========== BLOOD PROFILE TAB ==========

function renderBloodTab(content) {
    const bp = currentPatient.bloodProfile || {};
    const donations = bp.donations || [];
    const bpReadings = bp.bpReadings || [];
    const sugarReadings = bp.sugarReadings || [];
    const totalVolume = donations.reduce((sum, d) => sum + (d.volume || 0), 0);
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-tint mr-2 text-red-600"></i>🔴 Blood Type & RH Factor</h3>
                <div class="grid md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Blood Type</label>
                        <select id="blood-type" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">Not specified</option>
                            <option value="A" ${bp.bloodType === 'A' ? 'selected' : ''}>A</option>
                            <option value="B" ${bp.bloodType === 'B' ? 'selected' : ''}>B</option>
                            <option value="AB" ${bp.bloodType === 'AB' ? 'selected' : ''}>AB</option>
                            <option value="O" ${bp.bloodType === 'O' ? 'selected' : ''}>O</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">RH Factor</label>
                        <select id="rh-factor" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="">Not specified</option>
                            <option value="positive" ${bp.rhFactor === 'positive' ? 'selected' : ''}>Positive (+)</option>
                            <option value="negative" ${bp.rhFactor === 'negative' ? 'selected' : ''}>Negative (-)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Verified</label>
                        <label class="flex items-center space-x-2 mt-2">
                            <input type="checkbox" id="blood-verified" class="form-checkbox text-purple-600" ${bp.verified ? 'checked' : ''}>
                            <span class="text-sm">Lab confirmed</span>
                        </label>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                        <input type="date" id="blood-last-updated" class="w-full px-3 py-2 border border-gray-300 rounded-lg" value="${bp.lastDonation || ''}">
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center"><i class="fas fa-hand-holding-heart mr-2 text-red-600"></i>🩸 Blood Donation History (${donations.length})</h3>
                    <button onclick="addDonationRecord()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"><i class="fas fa-plus mr-2"></i>Add Donation</button>
                </div>
                <div id="donation-history" class="space-y-2 mb-4">
                    ${donations.length > 0 ? donations.map(d => `
                        <div class="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                            <div>
                                <span class="font-semibold text-red-800">🩸 ${d.date}</span>
                                <span class="text-sm text-gray-600 ml-2">${d.location || 'Unknown location'}</span>
                            </div>
                            <span class="text-sm font-semibold text-red-600">${d.volume || 450}ml - ${d.type || 'Whole Blood'}</span>
                        </div>
                    `).join('') : `<p class="text-sm text-gray-500 italic">No donation records yet</p>`}
                </div>
                <div class="mt-4 grid md:grid-cols-2 gap-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-gray-600">Total Donations</p>
                        <p class="text-2xl font-bold text-blue-600">${donations.length}</p>
                    </div>
                    <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p class="text-sm text-gray-600">Total Volume</p>
                        <p class="text-2xl font-bold text-purple-600">${totalVolume} ml</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center"><i class="fas fa-heartbeat mr-2 text-red-600"></i>📈 Blood Pressure (${bpReadings.length})</h3>
                    <button onclick="addBPReading()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"><i class="fas fa-plus mr-2"></i>Add Reading</button>
                </div>
                ${bp.latestBP ? `<p class="text-lg mb-3">Latest: <span class="font-bold text-green-600">${bp.latestBP}</span></p>` : ''}
                <div id="bp-history" class="space-y-2">
                    ${bpReadings.length > 0 ? bpReadings.slice(-5).reverse().map(r => `
                        <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <span class="text-sm text-gray-600">${new Date(r.datetime || r.createdAt).toLocaleString()}</span>
                            <span class="font-bold text-green-600">${r.systolic}/${r.diastolic}</span>
                        </div>
                    `).join('') : `<p class="text-sm text-gray-500 italic">No blood pressure readings yet</p>`}
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-gray-800 flex items-center"><i class="fas fa-candy-cane mr-2 text-pink-600"></i>🍬 Blood Sugar (${sugarReadings.length})</h3>
                    <button onclick="addBloodSugar()" class="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition text-sm font-semibold"><i class="fas fa-plus mr-2"></i>Add Reading</button>
                </div>
                ${bp.latestSugar ? `<p class="text-lg mb-3">Latest: <span class="font-bold text-pink-600">${bp.latestSugar} mg/dL</span></p>` : ''}
                <div id="sugar-history" class="space-y-2">
                    ${sugarReadings.length > 0 ? sugarReadings.slice(-5).reverse().map(r => `
                        <div class="flex items-center justify-between bg-pink-50 border border-pink-200 rounded-lg p-3">
                            <div>
                                <span class="text-sm text-gray-600">${new Date(r.datetime || r.createdAt).toLocaleString()}</span>
                                <span class="text-xs text-gray-500 ml-2">(${r.type})</span>
                            </div>
                            <span class="font-bold text-pink-600">${r.value} mg/dL</span>
                        </div>
                    `).join('') : `<p class="text-sm text-gray-500 italic">No blood sugar readings yet</p>`}
                </div>
            </div>
            
            <div class="flex justify-end">
                <button id="btn-save-blood" onclick="saveBloodProfile()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold">
                    <i class="fas fa-save mr-2"></i>Save Blood Profile
                </button>
            </div>
        </div>
    `;
}

// Add Donation Record
function addDonationRecord() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.id = 'blood-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-800">🩸 Add Donation Record</h3>
                <button onclick="closeBloodModal()" class="text-gray-400 hover:text-gray-600 text-2xl"><i class="fas fa-times"></i></button>
            </div>
            <div class="space-y-3">
                <div><label class="block text-sm font-semibold text-gray-700 mb-2">Donation Date</label><input type="date" id="donation-date" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                <div><label class="block text-sm font-semibold text-gray-700 mb-2">Location</label><input type="text" id="donation-location" placeholder="e.g., Red Cross" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                <div><label class="block text-sm font-semibold text-gray-700 mb-2">Volume (ml)</label><input type="number" id="donation-volume" value="450" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
            </div>
            <div class="flex space-x-2 mt-6">
                <button id="blood-modal-save" onclick="saveDonationRecord()" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"><i class="fas fa-save mr-2"></i>Save</button>
                <button onclick="closeBloodModal()" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function saveDonationRecord() {
    const date = document.getElementById('donation-date').value;
    const location = document.getElementById('donation-location').value;
    const volume = document.getElementById('donation-volume').value;
    if (!date) { showToast('❌ Please enter donation date', 'error'); return; }
    
    // Show loading
    const btn = document.getElementById('blood-modal-save');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    btn.disabled = true;
    
    const patientId = await ensurePatientInFirestore();
    if (!patientId) { closeBloodModal(); return; }
    try {
        const donation = { id: `donation-${Date.now()}`, date, location, volume: parseInt(volume) || 450, createdAt: new Date().toISOString() };
        await db.collection('patients').doc(patientId).update({
            'bloodProfile.donations': firebase.firestore.FieldValue.arrayUnion(donation),
            'bloodProfile.lastDonation': date,
            'bloodProfile.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Added Blood Donation',
            category: 'blood_profile',
            details: `${date} at ${location} (${volume}ml)`,
            newValue: `${date} - ${location}`
        });
        if (!currentPatient.bloodProfile) currentPatient.bloodProfile = {};
        if (!currentPatient.bloodProfile.donations) currentPatient.bloodProfile.donations = [];
        currentPatient.bloodProfile.donations.push(donation);
        closeBloodModal();
        showPatientTab('blood');
        showToast('🩸 Donation record saved!', 'success');
    } catch (error) {
        console.error('Error saving donation:', error);
        showToast('❌ Error saving donation record', 'error');
        closeBloodModal();
    }
}

// Add Blood Pressure Reading
function addBPReading() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.id = 'blood-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-800">📈 Add Blood Pressure</h3>
                <button onclick="closeBloodModal()" class="text-gray-400 hover:text-gray-600 text-2xl"><i class="fas fa-times"></i></button>
            </div>
            <div class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="block text-sm font-semibold text-gray-700 mb-2">Systolic</label><input type="number" id="bp-systolic" placeholder="120" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                    <div><label class="block text-sm font-semibold text-gray-700 mb-2">Diastolic</label><input type="number" id="bp-diastolic" placeholder="80" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
                </div>
            </div>
            <div class="flex space-x-2 mt-6">
                <button id="blood-modal-save" onclick="saveBPReading()" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"><i class="fas fa-save mr-2"></i>Save</button>
                <button onclick="closeBloodModal()" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function saveBPReading() {
    const systolic = document.getElementById('bp-systolic').value;
    const diastolic = document.getElementById('bp-diastolic').value;
    if (!systolic || !diastolic) { showToast('❌ Please enter both values', 'error'); return; }
    
    // Show loading
    const btn = document.getElementById('blood-modal-save');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    btn.disabled = true;
    
    const patientId = await ensurePatientInFirestore();
    if (!patientId) { closeBloodModal(); return; }
    try {
        const reading = { id: `bp-${Date.now()}`, datetime: new Date().toISOString(), systolic: parseInt(systolic), diastolic: parseInt(diastolic) };
        await db.collection('patients').doc(patientId).update({
            'bloodProfile.bpReadings': firebase.firestore.FieldValue.arrayUnion(reading),
            'bloodProfile.latestBP': `${systolic}/${diastolic}`,
            'bloodProfile.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Added Blood Pressure Reading',
            category: 'blood_profile',
            details: `${systolic}/${diastolic} mmHg`,
            newValue: `${systolic}/${diastolic}`
        });
        if (!currentPatient.bloodProfile) currentPatient.bloodProfile = {};
        if (!currentPatient.bloodProfile.bpReadings) currentPatient.bloodProfile.bpReadings = [];
        currentPatient.bloodProfile.bpReadings.push(reading);
        closeBloodModal();
        showPatientTab('blood');
        showToast(`📈 Blood pressure ${systolic}/${diastolic} saved!`, 'success');
    } catch (error) {
        console.error('Error saving BP:', error);
        showToast('❌ Error saving blood pressure', 'error');
        closeBloodModal();
    }
}

// Add Blood Sugar
function addBloodSugar() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.id = 'blood-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-800">🍬 Add Blood Sugar</h3>
                <button onclick="closeBloodModal()" class="text-gray-400 hover:text-gray-600 text-2xl"><i class="fas fa-times"></i></button>
            </div>
            <div class="space-y-3">
                <div><label class="block text-sm font-semibold text-gray-700 mb-2">Reading Type</label>
                    <select id="sugar-type" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="Fasting">Fasting</option>
                        <option value="Before Meal">Before Meal</option>
                        <option value="After Meal">After Meal (2hrs)</option>
                        <option value="Random">Random</option>
                    </select>
                </div>
                <div><label class="block text-sm font-semibold text-gray-700 mb-2">Value (mg/dL)</label><input type="number" id="sugar-value" placeholder="100" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></div>
            </div>
            <div class="flex space-x-2 mt-6">
                <button id="blood-modal-save" onclick="saveBloodSugar()" class="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition font-semibold"><i class="fas fa-save mr-2"></i>Save</button>
                <button onclick="closeBloodModal()" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function saveBloodSugar() {
    const type = document.getElementById('sugar-type').value;
    const value = document.getElementById('sugar-value').value;
    if (!value) { showToast('❌ Please enter blood sugar value', 'error'); return; }
    
    // Show loading
    const btn = document.getElementById('blood-modal-save');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    btn.disabled = true;
    
    const patientId = await ensurePatientInFirestore();
    if (!patientId) { closeBloodModal(); return; }
    try {
        const reading = { id: `sugar-${Date.now()}`, datetime: new Date().toISOString(), type, value: parseInt(value) };
        await db.collection('patients').doc(patientId).update({
            'bloodProfile.sugarReadings': firebase.firestore.FieldValue.arrayUnion(reading),
            'bloodProfile.latestSugar': parseInt(value),
            'bloodProfile.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Added Blood Sugar Reading',
            category: 'blood_profile',
            details: `${value} mg/dL (${type})`,
            newValue: `${value} mg/dL`
        });
        if (!currentPatient.bloodProfile) currentPatient.bloodProfile = {};
        if (!currentPatient.bloodProfile.sugarReadings) currentPatient.bloodProfile.sugarReadings = [];
        currentPatient.bloodProfile.sugarReadings.push(reading);
        closeBloodModal();
        showPatientTab('blood');
        showToast(`🍬 Blood sugar ${value} mg/dL saved!`, 'success');
    } catch (error) {
        console.error('Error saving blood sugar:', error);
        showToast('❌ Error saving blood sugar', 'error');
        closeBloodModal();
    }
}

function closeBloodModal() {
    const modal = document.getElementById('blood-modal');
    if (modal) modal.remove();
}

// Save Blood Profile
async function saveBloodProfile() {
    const btn = document.getElementById('btn-save-blood');
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
        const bloodType = document.getElementById('blood-type')?.value || '';
        const rhFactor = document.getElementById('rh-factor')?.value || '';
        const verified = document.getElementById('blood-verified')?.checked || false;
        await db.collection('patients').doc(patientId).update({
            'bloodProfile.bloodType': bloodType,
            'bloodProfile.rhFactor': rhFactor,
            'bloodProfile.verified': verified,
            'bloodProfile.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Updated Blood Profile',
            category: 'blood_profile',
            details: `Blood Type: ${bloodType}${rhFactor}, Verified: ${verified ? 'Yes' : 'No'}`,
            newValue: `${bloodType}${rhFactor}`
        });
        
        // Update local currentPatient object
        if (!currentPatient.bloodProfile) currentPatient.bloodProfile = {};
        currentPatient.bloodProfile.bloodType = bloodType;
        currentPatient.bloodProfile.rhFactor = rhFactor;
        currentPatient.bloodProfile.verified = verified;
        
        showToast('💾 Blood profile saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving blood profile:', error);
        showToast('❌ Error saving blood profile', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
