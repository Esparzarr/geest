import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ type: MongooseSchema.Types.UUID, default: () => uuidv7() })
  _id: Types.UUID

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  username: string

  // select: false -> el hash nunca sale en las consultas salvo que se pida explícitamente.
  @Prop({ required: true, select: false })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
