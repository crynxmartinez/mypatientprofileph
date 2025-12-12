// ========== FORMS TAB ==========

function renderFormsTab(content) {
    content.innerHTML = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <h3 class="text-xl font-bold mb-4">📤 Send Form to Patient</h3>
                <p class="mb-4 opacity-90">Generate a unique link and send it to the patient via SMS or Email.</p>
                <div class="grid md:grid-cols-2 gap-4">
                    <button onclick="sendFormLink('medical', '${currentPatient.id}', '${currentPatient.phone || currentPatient.email}', '${currentPatient.name}')" class="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"><i class="fas fa-heartbeat mr-2"></i>Medical History Form</button>
                    <button onclick="sendFormLink('consent', '${currentPatient.id}', '${currentPatient.phone || currentPatient.email}', '${currentPatient.name}')" class="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"><i class="fas fa-file-signature mr-2"></i>Consent Form</button>
                    <button onclick="sendFormLink('insurance', '${currentPatient.id}', '${currentPatient.phone || currentPatient.email}', '${currentPatient.name}')" class="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"><i class="fas fa-id-card mr-2"></i>Insurance Form</button>
                    <button onclick="sendFormLink('feedback', '${currentPatient.id}', '${currentPatient.phone || currentPatient.email}', '${currentPatient.name}')" class="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"><i class="fas fa-star mr-2"></i>Feedback Survey</button>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-check-circle mr-2 text-green-600"></i>✅ Completed Forms</h3>
                <div id="completed-forms" class="space-y-2"><div class="text-sm text-gray-500 italic">No forms completed yet</div></div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center"><i class="fas fa-clock mr-2 text-yellow-600"></i>⏳ Pending Forms</h3>
                <div id="pending-forms" class="space-y-2"><div class="text-sm text-gray-500 italic">No pending forms</div></div>
            </div>
        </div>
    `;
}

// Send Form Link
function sendFormLink(formType, patientId, contact, patientName) {
    const formId = Math.random().toString(36).substr(2, 9);
    const formLink = `https://your-domain.com/form/?type=${formType}&id=${formId}&patientId=${patientId}&contact=${encodeURIComponent(contact)}&name=${encodeURIComponent(patientName)}`;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-800">📤 Send ${formType.charAt(0).toUpperCase() + formType.slice(1)} Form</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 text-2xl"><i class="fas fa-times"></i></button>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Form Link</label>
                <div class="flex space-x-2">
                    <input type="text" value="${formLink}" readonly class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm">
                    <button onclick="navigator.clipboard.writeText('${formLink}'); showToast('📋 Link copied!', 'success')" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"><i class="fas fa-copy"></i></button>
                </div>
            </div>
            <div class="mb-4">
                <p class="text-sm text-gray-600">Send this link to: <span class="font-semibold">${contact}</span></p>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-4">
                <button onclick="sendViaSMS('${formLink}', '${contact}')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm">
                    <i class="fas fa-sms mr-2"></i>Send via SMS
                </button>
                <button onclick="sendViaEmail('${formLink}', '${contact}', '${patientName}', '${formType}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
                    <i class="fas fa-envelope mr-2"></i>Send via Email
                </button>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full mt-3 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Send via SMS (placeholder - requires SMS API like Twilio)
function sendViaSMS(link, phone) {
    showToast('📱 SMS sending requires Twilio or similar API integration', 'info');
    
    // Example implementation with Twilio:
    /*
    try {
        const response = await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: phone,
                message: `Please complete your form: ${link}`
            })
        });
        
        if (response.ok) {
            showToast('✅ SMS sent successfully!', 'success');
        } else {
            throw new Error('Failed to send SMS');
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
        showToast('❌ Error sending SMS', 'error');
    }
    */
}

// Send via Email (placeholder - requires email API)
function sendViaEmail(link, email, patientName, formType) {
    showToast('📧 Email sending requires email API integration (SendGrid, etc.)', 'info');
    
    // Example implementation:
    /*
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: email,
                subject: `Please complete your ${formType} form`,
                html: `
                    <h2>Hello ${patientName},</h2>
                    <p>Please complete your ${formType} form by clicking the link below:</p>
                    <a href="${link}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Complete Form</a>
                    <p>Thank you!</p>
                `
            })
        });
        
        if (response.ok) {
            showToast('✅ Email sent successfully!', 'success');
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        showToast('❌ Error sending email', 'error');
    }
    */
}
