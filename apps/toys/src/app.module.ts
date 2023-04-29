import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import * as Joi from 'joi'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {LoggerMiddleware} from '@app/common/middlewares/logger.middleware'
import {ConfigModule} from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['./apps/toys/.env'],
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
            }),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('/')
    }
}
