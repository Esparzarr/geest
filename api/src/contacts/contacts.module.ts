import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '../auth/auth.module.js'
import { ContactsController } from './contacts.controller.js'
import { ContactsService } from './contacts.service.js'
import { Department, DepartmentSchema } from '../departments/schemas/department.schema.js'
import { Contacts, ContactsSchema } from './schemas/contacts.schema.js'

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Contacts.name, schema: ContactsSchema },
      { name: Department.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
