import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  username: string

  // select: false -> el hash nunca sale en las consultas salvo que se pida explícitamente.
  @Prop({ required: true, select: false })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
