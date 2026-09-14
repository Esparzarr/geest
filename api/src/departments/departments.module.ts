import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '../auth/auth.module.js'
import { Contacts, ContactsSchema } from '../contacts/schemas/contacts.schema.js'
import { DepartmentsController } from './departments.controller.js'
import { DepartmentsService } from './departments.service.js'
import { Department, DepartmentSchema } from './schemas/department.schema.js'

@Module({
  imports: [
    AuthModule,
    // Contacts se registra aquí para poder revisar si un departamento está en uso
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Contacts.name, schema: ContactsSchema },
    ]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
