import {NestFactory} from '@nestjs/core'
import {AuthModule} from './auth.module'
import * as process from 'process'
import {Logger} from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AuthModule)
    await app.listen(process.env.PORT)
}
bootstrap().then(() => Logger.verbose(`[${process.env.NODE_ENV}] Listening on port ${process.env.PORT}`))
