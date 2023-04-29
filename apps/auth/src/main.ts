import {NestFactory} from '@nestjs/core'
import {AuthModule} from './auth.module'
import * as process from 'process'
import {Logger} from '@nestjs/common'
import {RabbitMQService} from '@app/common'

async function bootstrap() {
    const app = await NestFactory.create(AuthModule)
    const rabbitMQService = app.get<RabbitMQService>(RabbitMQService)
    app.connectMicroservice(rabbitMQService.getOptions('AUTH'))
    await app.startAllMicroservices()
}
bootstrap().then(() => Logger.verbose(`[${process.env.NODE_ENV}] Listening`))
