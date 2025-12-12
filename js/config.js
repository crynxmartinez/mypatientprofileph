// ========== FIREBASE CONFIGURATION ==========
// Replace with your own Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ========== GLOBAL VARIABLES ==========
let currentPatient = null;
let allPatients = [];

// Sample patient data for testing (remove in production)
const samplePatient = {
    id: 'PAT-001',
    name: 'Juan Dela Cruz',
    email: 'juan@email.com',
    phone: '09123456789',
    status: 'Active',
    totalVisits: 5,
    lastVisit: '2024-01-15',
    medicalHistory: {
        allergies: ['Penicillin'],
        medications: ['Metformin 500mg'],
        conditions: ['Diabetes', 'High Blood Pressure'],
        bloodPressure: '120/80',
        emergencyContact: '09987654321'
    },
    bloodProfile: {
        bloodType: 'O',
        rhFactor: 'positive',
        verified: true,
        donations: [],
        bpReadings: [],
        sugarReadings: []
    },
    dentalChart: {
        teeth: {}
    },
    treatmentPlans: [],
    files: {
        xrays: [],
        photos: [],
        documents: [],
        insurance: []
    },
    visits: []
};
