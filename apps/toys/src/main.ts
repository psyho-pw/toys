import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    await app.listen(configService.get<number>('PORT'))
}
bootstrap().then(() => Logger.verbose(`[${process.env.NODE_ENV}] Listening on port ${process.env.PORT}`))
