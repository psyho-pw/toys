import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {Logger} from '@nestjs/common'
import process from 'process'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(process.env.PORT)
}
bootstrap().then(() => Logger.verbose(`[${process.env.NODE_ENV}] Listening on port ${process.env.PORT}`))
