import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {Logger, ValidationPipe} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(configService.get<number>('PORT'))
}
bootstrap().then(() => Logger.verbose(`[${process.env.NODE_ENV}] Listening on port ${process.env.PORT}`))
