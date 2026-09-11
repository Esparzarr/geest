import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

// Define el tipo de documento para usarlo en los servicios
export type DepartmentDocument = HydratedDocument<Department>

@Schema({ timestamps: true, versionKey: false })
export class Department {
  @Prop({ type: MongooseSchema.Types.UUID, default: () => uuidv7() })
  _id: Types.UUID

  @Prop({ required: true })
  name: string

  // Los llena Mongoose por timestamps: true
  createdAt: Date
  updatedAt: Date
}

export const DepartmentSchema = SchemaFactory.createForClass(Department)
DepartmentSchema.index({ name: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } })
