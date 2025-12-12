# Patient Profile - Reference Guide

This folder contains all the extracted patient profile code from the clinic application, organized into separate files for easy reference and reuse.

## 📁 Folder Structure

```
mypatientprofileph/
├── index.html              # Main HTML file with patient profile structure
├── README.md               # This documentation file
└── js/
    ├── config.js           # Firebase configuration and global variables
    ├── utils.js            # Utility functions (toast, modals, helpers)
    ├── patient-profile.js  # Main patient profile functions (view, tabs, search)
    ├── medical-history.js  # Medical history tab (allergies, medications, conditions)
    ├── blood-profile.js    # Blood profile tab (blood type, BP, sugar readings)
    ├── dental-chart.js     # Interactive dental chart (32 teeth)
    ├── treatment-plans.js  # Treatment plans with procedures
    ├── files.js            # Files & images upload (X-rays, photos, documents)
    ├── forms.js            # Patient forms (medical, consent, insurance, feedback)
    └── activity-log.js     # Activity log tracking
```

## 🚀 Features

### 1. **Overview Tab**
- Contact information (email, phone, patient ID)
- Visit summary (total visits, last visit, status)
- Recent visits table

### 2. **Medical History Tab**
- ⚠️ Allergies management (add/remove)
- 💊 Current medications (add/remove)
- 🏥 Medical conditions checkboxes (Diabetes, High BP, Heart Disease, etc.)
- Vital information (blood pressure, emergency contact)

### 3. **Blood Profile Tab**
- 🔴 Blood type & RH factor
- 🩸 Blood donation history
- 📈 Blood pressure readings
- 🍬 Blood sugar readings

### 4. **Dental Chart Tab**
- 🦷 Interactive 32-tooth chart (FDI notation)
- Color-coded conditions:
  - Gray: Healthy
  - Red: Missing
  - Yellow: Cavity
  - Blue: Filling
  - Purple: Crown
  - Green: Root Canal
  - Orange: Bridge
  - Pink: Needs Attention

### 5. **Files & Images Tab**
- 🔬 X-Rays upload
- 📷 Intraoral photos
- 📄 Documents
- 💳 Insurance cards

### 6. **Treatment Plans Tab**
- 📋 Active treatment plans
- ✅ Completed treatment plans
- Procedures with status tracking
- Progress bar visualization

### 7. **Forms Tab**
- 📤 Send forms to patients via link
- Medical history form
- Consent form
- Insurance form
- Feedback survey

### 8. **Visit History Tab**
- Complete visit history across all clinics
- Date, time, clinic, doctor, service, status

### 9. **Activity Log Tab**
- Track all changes to patient profile
- Filter by category
- Timestamp and performer tracking

## 🔧 Setup Instructions

### 1. Firebase Configuration
Edit `js/config.js` and replace with your Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2. Firestore Collections Required
- `patients` - Patient records with medical data
- `appointments` - Visit/appointment records
- `patientLogs` - Activity log entries

### 3. Patient Document Structure
```javascript
{
    name: "Patient Name",
    email: "email@example.com",
    phone: "09123456789",
    medicalHistory: {
        allergies: [],
        medications: [],
        conditions: [],
        bloodPressure: "",
        emergencyContact: ""
    },
    bloodProfile: {
        bloodType: "O",
        rhFactor: "positive",
        verified: false,
        donations: [],
        bpReadings: [],
        sugarReadings: []
    },
    dentalChart: {
        teeth: {
            // tooth number: { condition, notes }
        }
    },
    treatmentPlans: [],
    files: {
        xrays: [],
        photos: [],
        documents: [],
        insurance: []
    }
}
```

## 📝 Usage

### View Patient Profile
```javascript
viewPatientProfile(patientObject);
```

### Switch Tabs
```javascript
showPatientTab('overview');
showPatientTab('medical');
showPatientTab('blood');
showPatientTab('dental');
showPatientTab('files');
showPatientTab('treatment');
showPatientTab('forms');
showPatientTab('visits');
showPatientTab('activity');
```

### Close Profile
```javascript
closePatientProfile();
```

## 🎨 Styling

Uses **TailwindCSS** via CDN for styling. All components use:
- Rounded corners (`rounded-xl`, `rounded-lg`)
- Shadow effects (`shadow-lg`)
- Purple/Blue gradient theme
- Responsive grid layouts

## 📦 Dependencies

- **TailwindCSS** - Styling
- **Font Awesome 6** - Icons
- **Firebase** - Backend (Firestore)

## 🔒 Security Notes

- Never expose Firebase API keys in client-side code for production
- Implement proper Firestore security rules
- Add authentication before accessing patient data

## 📄 License

This code is extracted from the MighTeeth Clinic application for reference purposes.
