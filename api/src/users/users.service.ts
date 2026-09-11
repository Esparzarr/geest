import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { validate } from 'uuid'
import { User, UserDocument } from './schemas/user.schema.js'

/**
 * Acceso de solo lectura a los usuarios.
 * La API no crea, modifica ni elimina usuarios: el usuario de prueba se siembra
 * directamente en MongoDB (ver docker/mongo-init.js).
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /** Incluye el hash de la contraseña. Usar solo para verificar credenciales. */
  async findByUsernameWithPassword(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).select('+password').exec()
  }

  async findById(id: string): Promise<UserDocument | null> {
    if (!validate(id)) return null
    return this.userModel.findById(id).exec()
  }
}
