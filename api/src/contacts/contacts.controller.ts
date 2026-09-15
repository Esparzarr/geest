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
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { ContactsService } from './contacts.service.js'
import { ContactResponseDto, ContactsPageDto } from './dto/contact-response.dto.js'
import { CreateContactDto } from './dto/create-contacts.dto.js'
import { FindContactsDto } from './dto/find-contacts.dto.js'
import { UpdateContactDto } from './dto/update-contacts.dto.js'

const IdParam = new ParseUUIDPipe({
  version: '7',
  exceptionFactory: () => new NotFoundException('Contacto no encontrado'),
})

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

  @Get()
  @ApiOkResponse({ type: ContactsPageDto })
  async findAll(@Query() query: FindContactsDto): Promise<ContactsPageDto> {
    return this.contacts.findAll(query)
  }

  @Patch(':id')
  @ApiOkResponse({ type: ContactResponseDto })
  async updateById(
    @Param('id', IdParam) id: string,
    @Body() dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    return this.contacts.updateById(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', IdParam) id: string): Promise<void> {
    return this.contacts.deleteById(id)
  }
}
