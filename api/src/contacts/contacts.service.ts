import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Department, DepartmentDocument } from '../departments/schemas/department.schema.js'
import { ContactResponseDto } from './dto/contact-response.dto.js'
import { CreateContactDto } from './dto/create-contacts.dto.js'
import { Contacts, ContactsDocument } from './schemas/contacts.schema.js'

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

  async deleteById(id: string): Promise<void> {
    const contact = await this.contactsModel.findByIdAndDelete(id)

    if (!contact) {
      throw new NotFoundException('Contacto no encontrado')
    }
  }
}
