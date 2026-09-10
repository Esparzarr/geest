import { Controller, Get } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { ApiOperation, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger'
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus'
import type { Connection } from 'mongoose'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
    // Se inyecta la conexión de la aplicación y se le pasa al indicador.
    // Sin esto, terminus recae en la conexión global de Mongoose, que Nest
    // nunca usa (crea la suya con createConnection) y siempre reporta caída.
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Estado del servicio',
    description:
      'Verifica que la API responda y que la conexión con MongoDB esté activa. ' +
      'Devuelve 503 si algún componente falla, para que un balanceador o un ' +
      'orquestador deje de enviarle tráfico a la instancia.',
  })
  @ApiServiceUnavailableResponse({
    description: 'Algún componente no está disponible',
    schema: {
      example: {
        status: 'error',
        info: {},
        error: { mongodb: { status: 'down', message: 'Not connected to database' } },
        details: { mongodb: { status: 'down', message: 'Not connected to database' } },
      },
    },
  })
  check() {
    // El timeout evita que una base colgada deje la petición esperando indefinidamente.
    return this.health.check([
      () => this.mongo.pingCheck('mongodb', { connection: this.connection }).withTimeout(1500),
    ])
  }
}
