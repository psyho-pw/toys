import {NestFactory} from '@nestjs/core'
import {AuthModule} from './auth.module'
import {Logger, ValidationPipe} from '@nestjs/common'
import {AUTH_SERVICE, RabbitMQService} from '@app/common'
import {ConfigService} from '@nestjs/config'

async function bootstrap() {
    const app = await NestFactory.create(AuthModule)
    const rabbitMQService = app.get<RabbitMQService>(RabbitMQService)
    app.connectMicroservice(rabbitMQService.getOptions(AUTH_SERVICE, true))
    app.useGlobalPipes(new ValidationPipe())

    const configService = app.get<ConfigService>(ConfigService)
    await app.startAllMicroservices()
    await app.listen(configService.get<string>('PORT'))
}
bootstrap().then(() => Logger.verbose(`[${AuthModule.name}] Listening on port ${process.env.PORT}`))
