import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/** Protege un endpoint: exige un JWT válido en el header Authorization. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
