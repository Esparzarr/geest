import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

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

  @Prop({ required: true })
  department: string

  createdAt: Date
  updatedAt: Date
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts)
ContactsSchema.index({ email: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } })
