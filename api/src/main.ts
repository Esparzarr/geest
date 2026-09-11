import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Todas las rutas de la API quedan bajo /api
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // descarta propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // y responde 400 si llegan
      transform: true,
      stopAtFirstError: true, // un solo mensaje por campo: el del primer decorador que falla
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Geest API')
    .setDescription(
      'Autenticación con usuario y contraseña. Usuario de prueba: `testuser` / `Test1234!`',
    )
    .setVersion('1.0')
    .addBearerAuth() // para los endpoints protegidos que vengan después
    .build()

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config), {
    swaggerOptions: { persistAuthorization: true },
  })

  const port = process.env.PORT ?? 4000
  await app.listen(port)
  console.log(`API:     http://localhost:${port}/api`)
  console.log(`Swagger: http://localhost:${port}/docs`)
}
await bootstrap()
