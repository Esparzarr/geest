import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'
import { Department } from '../../departments/schemas/department.schema.js'

export type ContactsDocument = HydratedDocument<Contacts>

@Schema({ timestamps: true, versionKey: false })
export class Contacts {
  @Prop({ type: MongooseSchema.Types.UUID, default: () => uuidv7() })
  _id: Types.UUID

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ required: false })
  phone?: string

  @Prop({ type: MongooseSchema.Types.UUID, ref: Department.name, required: true })
  department: Types.UUID

  createdAt: Date
  updatedAt: Date
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts)
ContactsSchema.index({ email: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } })
