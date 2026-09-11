import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { DepartmentsService } from './departments.service.js'
import { CreateDepartmentDto } from './dto/create-department.dto.js'
import { DepartmentResponseDto } from './dto/department-response.dto.js'
import { UpdateDepartmentDto } from './dto/update-department.dto.js'

// Valida que el id sea un UUID v7 antes de llegar a Mongo.
// Si no lo es, responde "no encontrado" en vez de un error de validación:
// para quien consume la API, un id mal formado tampoco identifica a nadie.
const IdParam = new ParseUUIDPipe({
  version: '7',
  exceptionFactory: () => new NotFoundException('Departamento no encontrado'),
})

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

  @Patch(':id')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async updateById(
    @Param('id', IdParam) id: string,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    return this.departments.updateById(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', IdParam) id: string): Promise<void> {
    return this.departments.deleteById(id)
  }
}
