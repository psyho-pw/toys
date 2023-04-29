import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import * as Joi from 'joi'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {LoggerMiddleware} from '@app/common/middlewares/logger.middleware'
import {ConfigModule} from '@nestjs/config'
import {AuthModule, RabbitMQModule} from '@app/common'
import {AUTH_SERVICE} from './constants/services'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['./apps/toys/.env'],
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
            }),
        }),
        RabbitMQModule.register({name: AUTH_SERVICE}),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('/')
    }
}
