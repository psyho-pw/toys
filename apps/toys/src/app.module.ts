import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import * as Joi from 'joi'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ConfigModule} from '@nestjs/config'
import {AUTH_SERVICE, AuthModule, HealthModule, MariaModule, RabbitMQModule} from '@app/common'
import {LoggerMiddleware} from '@app/common/utils/middlewares/logger.middleware'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['./apps/toys/.env'],
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                DISCORD_WEBHOOK_URL: Joi.string().required(),

                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
            }),
        }),
        RabbitMQModule.register({name: AUTH_SERVICE}),
        AuthModule,
        HealthModule,
        MariaModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('/')
    }
}
