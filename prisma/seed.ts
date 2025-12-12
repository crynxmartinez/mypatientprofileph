import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
    },
  })

  console.log('✅ Admin user created:', admin.username)

  // Create sample patient
  const patient = await prisma.patient.upsert({
    where: { patientId: 'PAT-001' },
    update: {},
    create: {
      patientId: 'PAT-001',
      name: 'Juan Dela Cruz',
      email: 'juan@email.com',
      phone: '09123456789',
      status: 'Active',
      totalVisits: 5,
      lastVisit: new Date('2024-01-15'),
      medicalHistory: {
        create: {
          allergies: ['Penicillin'],
          medications: ['Metformin 500mg'],
          conditions: ['Diabetes', 'High Blood Pressure'],
          bloodPressure: '120/80',
          emergencyContact: '09987654321',
        },
      },
      bloodProfile: {
        create: {
          bloodType: 'O',
          rhFactor: 'positive',
          verified: true,
          donations: [],
          bpReadings: [],
          sugarReadings: [],
        },
      },
    },
  })

  console.log('✅ Sample patient created:', patient.name)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
