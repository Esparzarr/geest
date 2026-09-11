import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateDepartmentDto } from './dto/create-department.dto.js'
import { DepartmentResponseDto } from './dto/department-response.dto.js'
import { UpdateDepartmentDto } from './dto/update-department.dto.js'
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

  async updateById(id: string, dto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    let department: DepartmentDocument | null

    try {
      department = await this.departmentModel.findByIdAndUpdate(
        id,
        { name: dto.name },
        { new: true },
      )
    } catch (error) {
      // 11000: MongoDB rechazó el nombre porque ya existe (índice único)
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException('Ya existe un departamento con ese nombre')
      }
      throw error
    }

    // findByIdAndUpdate devuelve null si ningún departamento tiene ese id
    if (!department) {
      throw new NotFoundException('Departamento no encontrado')
    }

    return {
      id: department.id as string,
      name: department.name,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    }
  }

  async deleteById(id: string): Promise<void> {
    const department = await this.departmentModel.findByIdAndDelete(id)

    // findByIdAndDelete devuelve null si ningún departamento tiene ese id
    if (!department) {
      throw new NotFoundException('Departamento no encontrado')
    }
  }
}
