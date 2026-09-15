import { NestFactory } from '@nestjs/core'
import { getModelToken } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { AppModule } from './app.module.js'
import { Contacts, type ContactsDocument } from './contacts/schemas/contacts.schema.js'
import { Department, type DepartmentDocument } from './departments/schemas/department.schema.js'

// Los contactos de ejemplo se reconocen por este dominio: --clean borra solo esos
const DOMAIN = 'geest.test'
const BATCH = 5000

const DEPARTMENTS = [
  'Ventas',
  'Recursos Humanos',
  'Sistemas',
  'Finanzas',
  'Marketing',
  'Operaciones',
  'Compras',
  'Soporte',
  'Legal',
  'Calidad',
]

const FIRST_NAMES = [
  'Ana',
  'Luis',
  'María',
  'Carlos',
  'Sofía',
  'Miguel',
  'Lucía',
  'Jorge',
  'Valeria',
  'Diego',
  'Camila',
  'Andrés',
  'Paula',
  'Ricardo',
  'Elena',
  'Fernando',
]

const LAST_NAMES = [
  'García',
  'Martínez',
  'López',
  'Hernández',
  'Rodríguez',
  'Pérez',
  'Sánchez',
  'Ramírez',
  'Torres',
  'Flores',
  'Rivera',
  'Gómez',
  'Díaz',
  'Vargas',
  'Castro',
]

/** Lee --contacts=500, la variable de entorno, o el valor por defecto. */
function readNumber(flag: string, envVar: string, fallback: number): number {
  const prefix = `--${flag}=`
  const fromArgs = process.argv.find((arg) => arg.startsWith(prefix))
  const value = Number(fromArgs ? fromArgs.slice(prefix.length) : process.env[envVar])
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback
}

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)]

async function seed() {
  const totalContacts = readNumber('contacts', 'SEED_CONTACTS', 1000)
  const totalDepartments = readNumber('departments', 'SEED_DEPARTMENTS', 5)

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error'] })
  const contactModel = app.get<Model<ContactsDocument>>(getModelToken(Contacts.name))
  const departmentModel = app.get<Model<DepartmentDocument>>(getModelToken(Department.name))
  const seedEmails = { email: { $regex: `@${DOMAIN}$` } }

  if (process.argv.includes('--clean')) {
    const { deletedCount } = await contactModel.deleteMany(seedEmails)
    console.log(`Borrados ${deletedCount} contactos de ejemplo`)
  }

  // El nombre del departamento es único, así que se reutiliza si ya existe
  const names = DEPARTMENTS.slice(0, totalDepartments)
  for (const name of names) {
    await departmentModel.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true })
  }
  const departments = await departmentModel.find({ name: { $in: names } })
  console.log(`Departamentos disponibles: ${departments.length}`)

  // Se parte de los que ya hay para que dos corridas seguidas no repitan el correo
  const created = await contactModel.countDocuments(seedEmails)
  const start = Date.now()
  let inserted = 0

  while (inserted < totalContacts) {
    const size = Math.min(BATCH, totalContacts - inserted)
    const batch = Array.from({ length: size }, (_, index) => {
      const number = created + inserted + index + 1
      // Fechas escalonadas hacia atrás: así se nota el orden por createdAt
      const date = new Date(start - number * 1000)
      return {
        name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
        email: `contacto${number}@${DOMAIN}`,
        phone: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
        department: pick(departments)._id,
        createdAt: date,
        updatedAt: date,
      }
    })

    // ordered: false sigue aunque algún correo exista; timestamps: false respeta las fechas
    await contactModel.insertMany(batch, { ordered: false, timestamps: false })
    inserted += size
    console.log(`  ${inserted} de ${totalContacts}`)
  }

  console.log(`Listo: ${inserted} contactos insertados en ${Date.now() - start} ms`)
  console.log(`Total de contactos en la base: ${await contactModel.countDocuments()}`)

  await app.close()
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
