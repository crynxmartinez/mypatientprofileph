// ========== TREATMENT PLANS TAB ==========

function renderTreatmentTab(content) {
    const plans = currentPatient?.treatmentPlans || [];
    const activePlans = plans.filter(p => p.status === 'active');
    const completedPlans = plans.filter(p => p.status === 'completed');
    
    const getProcedureIcon = (status) => {
        const icons = {
            'pending': '<i class="fas fa-clock text-gray-400"></i>',
            'scheduled': '<i class="fas fa-calendar text-blue-500"></i>',
            'in-progress': '<i class="fas fa-spinner text-yellow-500"></i>',
            'success': '<i class="fas fa-check-circle text-green-500"></i>',
            'failed': '<i class="fas fa-times-circle text-red-500"></i>',
            'cancelled': '<i class="fas fa-ban text-gray-500"></i>'
        };
        return icons[status] || icons['pending'];
    };
    
    const renderProcedure = (proc, planId) => `
        <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div class="flex items-center space-x-3">
                ${getProcedureIcon(proc.status)}
                <div>
                    <p class="font-semibold text-gray-800">${proc.name}</p>
                    <p class="text-xs text-gray-500">${proc.date ? new Date(proc.date).toLocaleDateString() : 'No date set'} ${proc.notes ? '• ' + proc.notes : ''}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <select onchange="updateProcedureStatus('${planId}', '${proc.id}', this.value)" class="text-xs border border-gray-300 rounded px-2 py-1">
                    <option value="pending" ${proc.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="scheduled" ${proc.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                    <option value="in-progress" ${proc.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="success" ${proc.status === 'success' ? 'selected' : ''}>Success</option>
                    <option value="failed" ${proc.status === 'failed' ? 'selected' : ''}>Failed</option>
                    <option value="cancelled" ${proc.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button onclick="deleteProcedure('${planId}', '${proc.id}')" class="text-red-500 hover:text-red-700 text-sm"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    const renderPlan = (plan, isCompleted = false) => {
        const procedures = plan.procedures || [];
        const successCount = procedures.filter(p => p.status === 'success').length;
        const totalCount = procedures.length;
        const progress = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
        
        return `
            <div class="border-2 ${isCompleted ? 'border-green-200 bg-green-50' : 'border-purple-200 bg-purple-50'} rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg">${plan.title}</h4>
                        <p class="text-xs text-gray-500">Created: ${new Date(plan.createdAt).toLocaleDateString()} ${plan.tooth ? '• Tooth #' + plan.tooth : ''}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${!isCompleted ? `
                            <button onclick="addProcedure('${plan.id}')" class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-xs font-semibold"><i class="fas fa-plus mr-1"></i>Add Procedure</button>
                            <button onclick="completePlan('${plan.id}')" class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-xs font-semibold"><i class="fas fa-check mr-1"></i>Complete</button>
                        ` : `
                            <button onclick="reopenPlan('${plan.id}')" class="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-xs font-semibold"><i class="fas fa-redo mr-1"></i>Reopen</button>
                        `}
                        <button onclick="deletePlan('${plan.id}')" class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-xs font-semibold"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="mb-3">
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>${successCount}/${totalCount} procedures (${progress}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full transition-all" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <!-- Procedures List -->
                <div class="space-y-2">
                    ${procedures.length > 0 ? procedures.map(proc => renderProcedure(proc, plan.id)).join('') : '<p class="text-sm text-gray-500 italic text-center py-2">No procedures added yet</p>'}
                </div>
            </div>
        `;
    };
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center"><i class="fas fa-procedures mr-2 text-green-600"></i>📋 Active Treatment Plans (${activePlans.length})</h3>
                    <button onclick="createTreatmentPlan()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"><i class="fas fa-plus mr-2"></i>New Plan</button>
                </div>
                <div id="active-plans" class="space-y-4">
                    ${activePlans.length > 0 ? activePlans.map(plan => renderPlan(plan, false)).join('') : '<div class="text-sm text-gray-500 italic text-center py-8">No active treatment plans</div>'}
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-check-circle mr-2 text-blue-600"></i>✅ Completed Treatment Plans (${completedPlans.length})</h3>
                <div id="completed-plans" class="space-y-4">
                    ${completedPlans.length > 0 ? completedPlans.map(plan => renderPlan(plan, true)).join('') : '<div class="text-sm text-gray-500 italic">No completed treatment plans</div>'}
                </div>
            </div>
        </div>
    `;
}

// Create Treatment Plan
function createTreatmentPlan() {
    showInputModal('📋 Create Treatment Plan', 'Enter treatment plan title (e.g., Root Canal Treatment)', 'Create Plan', async (title) => {
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        try {
            const newPlan = { id: `plan-${Date.now()}`, title, status: 'active', createdAt: new Date().toISOString(), procedures: [] };
            await db.collection('patients').doc(patientId).update({
                treatmentPlans: firebase.firestore.FieldValue.arrayUnion(newPlan)
            });
            // Log the change
            await logPatientChange(patientId, {
                action: 'Created Treatment Plan',
                category: 'treatment_plan',
                details: title,
                newValue: title
            });
            if (!currentPatient.treatmentPlans) currentPatient.treatmentPlans = [];
            currentPatient.treatmentPlans.push(newPlan);
            showPatientTab('treatment');
            showToast(`✅ Created treatment plan: ${title}`, 'success');
        } catch (error) {
            showToast('❌ Error creating treatment plan', 'error');
        }
    });
}

// Add Procedure
function addProcedure(planId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.id = 'procedure-modal';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-800">➕ Add Procedure</h3>
                <button onclick="closeProcedureModal()" class="text-gray-400 hover:text-gray-600 text-2xl"><i class="fas fa-times"></i></button>
            </div>
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Procedure Name</label>
                    <input type="text" id="proc-name" placeholder="e.g., X-Ray, Cleaning, Extraction" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Scheduled Date (Optional)</label>
                    <input type="date" id="proc-date" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                    <input type="text" id="proc-notes" placeholder="Additional notes..." class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Initial Status</label>
                    <select id="proc-status" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                    </select>
                </div>
            </div>
            <div class="flex space-x-2 mt-6">
                <button id="proc-save-btn" onclick="saveProcedure('${planId}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"><i class="fas fa-save mr-2"></i>Add Procedure</button>
                <button onclick="closeProcedureModal()" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeProcedureModal() {
    const modal = document.getElementById('procedure-modal');
    if (modal) modal.remove();
}

async function saveProcedure(planId) {
    const name = document.getElementById('proc-name').value.trim();
    if (!name) { showToast('❌ Please enter procedure name', 'error'); return; }
    
    const date = document.getElementById('proc-date').value;
    const notes = document.getElementById('proc-notes').value.trim();
    const status = document.getElementById('proc-status').value;
    
    // Show loading
    const btn = document.getElementById('proc-save-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    btn.disabled = true;
    
    const patientId = await ensurePatientInFirestore();
    if (!patientId) { closeProcedureModal(); return; }
    
    try {
        const newProcedure = { id: `proc-${Date.now()}`, name, date, notes, status, createdAt: new Date().toISOString() };
        
        // Find and update the plan
        const planIndex = currentPatient.treatmentPlans.findIndex(p => p.id === planId);
        if (planIndex === -1) throw new Error('Plan not found');
        
        if (!currentPatient.treatmentPlans[planIndex].procedures) {
            currentPatient.treatmentPlans[planIndex].procedures = [];
        }
        currentPatient.treatmentPlans[planIndex].procedures.push(newProcedure);
        
        // Save to Firestore
        await db.collection('patients').doc(patientId).update({
            treatmentPlans: currentPatient.treatmentPlans,
            'treatmentPlans.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
        });
        // Log the change
        const planTitle = currentPatient.treatmentPlans[planIndex].title;
        await logPatientChange(patientId, {
            action: 'Added Procedure',
            category: 'treatment_plan',
            details: `${name} to "${planTitle}"`,
            newValue: name
        });
        
        closeProcedureModal();
        showPatientTab('treatment');
        showToast(`✅ Added procedure: ${name}`, 'success');
    } catch (error) {
        console.error('Error adding procedure:', error);
        showToast('❌ Error adding procedure', 'error');
        closeProcedureModal();
    }
}

// Update Procedure Status
async function updateProcedureStatus(planId, procId, newStatus) {
    const patientId = await ensurePatientInFirestore();
    if (!patientId) return;
    
    try {
        const planIndex = currentPatient.treatmentPlans.findIndex(p => p.id === planId);
        if (planIndex === -1) return;
        
        const procIndex = currentPatient.treatmentPlans[planIndex].procedures.findIndex(p => p.id === procId);
        if (procIndex === -1) return;
        
        const procName = currentPatient.treatmentPlans[planIndex].procedures[procIndex].name;
        const oldStatus = currentPatient.treatmentPlans[planIndex].procedures[procIndex].status;
        
        currentPatient.treatmentPlans[planIndex].procedures[procIndex].status = newStatus;
        currentPatient.treatmentPlans[planIndex].procedures[procIndex].updatedAt = new Date().toISOString();
        
        await db.collection('patients').doc(patientId).update({
            treatmentPlans: currentPatient.treatmentPlans
        });
        // Log the change
        await logPatientChange(patientId, {
            action: 'Updated Procedure Status',
            category: 'treatment_plan',
            details: `${procName}: ${oldStatus} → ${newStatus}`,
            previousValue: oldStatus,
            newValue: newStatus
        });
        
        showPatientTab('treatment');
        showToast(`✅ Status updated to: ${newStatus}`, 'success');
    } catch (error) {
        console.error('Error updating procedure status:', error);
        showToast('❌ Error updating status', 'error');
    }
}

// Delete Procedure
function deleteProcedure(planId, procId) {
    showConfirmModal('Delete Procedure', 'Are you sure you want to delete this procedure?', async () => {
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        
        try {
            const planIndex = currentPatient.treatmentPlans.findIndex(p => p.id === planId);
            if (planIndex === -1) return;
            
            const proc = currentPatient.treatmentPlans[planIndex].procedures.find(p => p.id === procId);
            const procName = proc?.name || 'Unknown';
            const planTitle = currentPatient.treatmentPlans[planIndex].title;
            
            currentPatient.treatmentPlans[planIndex].procedures = currentPatient.treatmentPlans[planIndex].procedures.filter(p => p.id !== procId);
            
            await db.collection('patients').doc(patientId).update({
                treatmentPlans: currentPatient.treatmentPlans
            });
            // Log the change
            await logPatientChange(patientId, {
                action: 'Deleted Procedure',
                category: 'treatment_plan',
                details: `${procName} from "${planTitle}"`,
                previousValue: procName
            });
            
            showPatientTab('treatment');
            showToast('🗑️ Procedure deleted', 'success');
        } catch (error) {
            console.error('Error deleting procedure:', error);
            showToast('❌ Error deleting procedure', 'error');
        }
    }, 'Delete', 'red');
}

// Complete Plan
function completePlan(planId) {
    showConfirmModal('Complete Plan', 'Mark this treatment plan as completed?', async () => {
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        
        try {
            const planIndex = currentPatient.treatmentPlans.findIndex(p => p.id === planId);
            if (planIndex === -1) return;
            
            const planTitle = currentPatient.treatmentPlans[planIndex].title;
            currentPatient.treatmentPlans[planIndex].status = 'completed';
            currentPatient.treatmentPlans[planIndex].completedAt = new Date().toISOString();
            
            await db.collection('patients').doc(patientId).update({
                treatmentPlans: currentPatient.treatmentPlans
            });
            // Log the change
            await logPatientChange(patientId, {
                action: 'Completed Treatment Plan',
                category: 'treatment_plan',
                details: planTitle,
                previousValue: 'active',
                newValue: 'completed'
            });
            
            showPatientTab('treatment');
            showToast('✅ Treatment plan completed!', 'success');
        } catch (error) {
            console.error('Error completing plan:', error);
            showToast('❌ Error completing plan', 'error');
        }
    }, 'Complete', 'green');
}

// Reopen Plan
function reopenPlan(planId) {
    showConfirmModal('Reopen Plan', 'Reopen this treatment plan?', async () => {
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        
        try {
            const planIndex = currentPatient.treatmentPlans.findIndex(p => p.id === planId);
            if (planIndex === -1) return;
            
            const planTitle = currentPatient.treatmentPlans[planIndex].title;
            currentPatient.treatmentPlans[planIndex].status = 'active';
            delete currentPatient.treatmentPlans[planIndex].completedAt;
            
            await db.collection('patients').doc(patientId).update({
                treatmentPlans: currentPatient.treatmentPlans
            });
            // Log the change
            await logPatientChange(patientId, {
                action: 'Reopened Treatment Plan',
                category: 'treatment_plan',
                details: planTitle,
                previousValue: 'completed',
                newValue: 'active'
            });
            
            showPatientTab('treatment');
            showToast('🔄 Treatment plan reopened', 'success');
        } catch (error) {
            console.error('Error reopening plan:', error);
            showToast('❌ Error reopening plan', 'error');
        }
    }, 'Reopen', 'yellow');
}

// Delete Plan
function deletePlan(planId) {
    showConfirmModal('Delete Treatment Plan', 'Delete this entire treatment plan? This cannot be undone.', async () => {
        const patientId = await ensurePatientInFirestore();
        if (!patientId) return;
        
        try {
            const plan = currentPatient.treatmentPlans.find(p => p.id === planId);
            const planTitle = plan?.title || 'Unknown';
            
            currentPatient.treatmentPlans = currentPatient.treatmentPlans.filter(p => p.id !== planId);
            
            await db.collection('patients').doc(patientId).update({
                treatmentPlans: currentPatient.treatmentPlans
            });
            // Log the change
            await logPatientChange(patientId, {
                action: 'Deleted Treatment Plan',
                category: 'treatment_plan',
                details: planTitle,
                previousValue: planTitle
            });
            
            showPatientTab('treatment');
            showToast('🗑️ Treatment plan deleted', 'success');
        } catch (error) {
            console.error('Error deleting plan:', error);
            showToast('❌ Error deleting plan', 'error');
        }
    }, 'Delete', 'red');
}
