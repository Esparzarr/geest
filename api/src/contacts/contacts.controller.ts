import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { ContactsService } from './contacts.service.js'
import { ContactResponseDto } from './dto/contact-response.dto.js'
import { CreateContactDto } from './dto/create-contacts.dto.js'

@ApiTags('contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contacts: ContactsService) {}

  @Post()
  @ApiCreatedResponse({ type: ContactResponseDto })
  async create(@Body() dto: CreateContactDto): Promise<ContactResponseDto> {
    return this.contacts.create(dto)
  }
}
