import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isUUID } from 'class-validator'
import { Model, QueryFilter } from 'mongoose'
import { Department, DepartmentDocument } from '../departments/schemas/department.schema.js'
import { ContactResponseDto, ContactsPageDto } from './dto/contact-response.dto.js'
import { CreateContactDto } from './dto/create-contacts.dto.js'
import { FindContactsDto } from './dto/find-contacts.dto.js'
import { Contacts, ContactsDocument } from './schemas/contacts.schema.js'
import { UpdateContactDto } from './dto/update-contacts.dto.js'

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name)
    private readonly contactsModel: Model<ContactsDocument>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactResponseDto> {
    const department = await this.departmentModel.findById(dto.department)

    if (!department) {
      throw new NotFoundException('Departamento no encontrado')
    }

    try {
      const contact = await this.contactsModel.create({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        department: dto.department,
      })

      return {
        id: contact.id as string,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        department: {
          id: department.id as string,
          name: department.name,
        },
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      }
    } catch (error) {
      // 11000: MongoDB rechazó el nombre porque ya existe (índice único)
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException('Ya existe un contacto con ese correo')
      }
      throw error
    }
  }

  async findAll(query: FindContactsDto): Promise<ContactsPageDto> {
    const filter: QueryFilter<ContactsDocument> = {}

    // Coincidencia parcial en el nombre, sin distinguir mayúsculas
    if (query.search) {
      filter.name = { $regex: escapeRegExp(query.search), $options: 'i' }
    }

    // Uno o varios departamentos, por id o por nombre
    if (query.department?.length) {
      const ids = query.department.filter((value) => isUUID(value))
      const names = query.department.filter((value) => !isUUID(value))

      if (names.length) {
        // La colación hace que el nombre no distinga mayúsculas, igual que en departamentos
        const departments = await this.departmentModel
          .find({ name: { $in: names } })
          .collation({ locale: 'es', strength: 2 })
        ids.push(...departments.map((department) => department.id as string))
      }

      filter.department = { $in: ids }
    }

    // Sin un tope, una colección grande llegaría entera al navegador de una sola vez
    const limit = query.limit ?? 10
    const offset = query.offset ?? 0

    // El total se cuenta con los mismos filtros, para saber cuántas páginas hay
    const [contacts, total] = await Promise.all([
      this.contactsModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate<{ department: DepartmentDocument }>('department'),
      this.contactsModel.countDocuments(filter),
    ])

    return {
      data: contacts.map((contact) => ({
        id: contact.id as string,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        department: { id: contact.department.id as string, name: contact.department.name },
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      })),
      total,
    }
  }

  async deleteById(id: string): Promise<void> {
    const contact = await this.contactsModel.findByIdAndDelete(id)

    if (!contact) {
      throw new NotFoundException('Contacto no encontrado')
    }
  }

  async updateById(id: string, dto: UpdateContactDto): Promise<ContactResponseDto> {
    if (dto.department) {
      const newDepartment = await this.departmentModel.findById(dto.department)
      if (!newDepartment) throw new NotFoundException('Departamento no encontrado')
    }

    let contact: ContactsDocument | null

    try {
      contact = await this.contactsModel.findByIdAndUpdate(
        id,
        { ...dto },
        { new: true, runValidators: true },
      )
    } catch (error) {
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException('Ya existe un contacto con el mismo correo')
      }
      if ((error as { name?: string }).name === 'ValidationError') {
        throw new BadRequestException('Datos inválidos')
      }
      throw error
    }

    if (!contact) {
      throw new NotFoundException('Contacto no encontrado')
    }

    const department = await this.departmentModel.findById(contact.department)
    if (!department) throw new NotFoundException('Departamento no encontrado')

    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      department: { id: department.id as string, name: department.name },
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    }
  }
}

// Sin esto, un "(" o un "*" en la búsqueda rompería la expresión regular
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
