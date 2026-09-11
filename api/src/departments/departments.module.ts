import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '../auth/auth.module.js'
import { DepartmentsController } from './departments.controller.js'
import { DepartmentsService } from './departments.service.js'
import { Department, DepartmentSchema } from './schemas/department.schema.js'

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
})
export class DepartmentsModule {}
