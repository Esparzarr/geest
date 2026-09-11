import { ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateDepartmentDto } from './dto/create-department.dto.js'
import { DepartmentResponseDto } from './dto/department-response.dto.js'
import { Department, DepartmentDocument } from './schemas/department.schema.js'

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    try {
      const department = await this.departmentModel.create({ name: dto.name })
      return {
        id: department.id as string,
        name: department.name,
        createdAt: department.createdAt,
        updatedAt: department.updatedAt,
      }
    } catch (error) {
      // 11000: MongoDB rechazó el nombre porque ya existe (índice único)
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException('Ya existe un departamento con ese nombre')
      }
      throw error
    }
  }

  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentModel.find()
    return departments.map((department) => ({
      id: department.id as string,
      name: department.name,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    }))
  }
}
