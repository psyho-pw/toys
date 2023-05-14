import {NestFactory} from '@nestjs/core'
import {Logger, ValidationPipe} from '@nestjs/common'
import {FILES_SERVICE, RabbitMQService} from '@app/common'
import {ConfigService} from '@nestjs/config'
import {MainModule} from './main.module'

async function bootstrap() {
    const app = await NestFactory.create(MainModule)
    const rabbitMQService = app.get<RabbitMQService>(RabbitMQService)
    app.connectMicroservice(rabbitMQService.getOptions(FILES_SERVICE, true))
    app.useGlobalPipes(new ValidationPipe())

    const configService = app.get<ConfigService>(ConfigService)
    await app.startAllMicroservices()
    await app.listen(configService.get<number>('PORT'))
}

bootstrap().then(() => Logger.verbose(`[${MainModule.name}] Listening on port ${process.env.PORT}`))
