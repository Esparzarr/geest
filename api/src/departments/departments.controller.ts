import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { DepartmentsService } from './departments.service.js'
import { CreateDepartmentDto } from './dto/create-department.dto.js'
import { DepartmentResponseDto } from './dto/department-response.dto.js'

@ApiTags('departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departments: DepartmentsService) {}

  @Post()
  @ApiCreatedResponse({ type: DepartmentResponseDto })
  async create(@Body() dto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    return this.departments.create(dto)
  }

  @Get()
  @ApiOkResponse({ type: [DepartmentResponseDto] })
  async findAll(): Promise<DepartmentResponseDto[]> {
    return this.departments.findAll()
  }
}
