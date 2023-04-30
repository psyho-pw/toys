import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {MariaModule, RabbitMQModule} from '@app/common'
import * as Joi from 'joi'
import {UserModule} from './users/user.module'
import {JwtModule} from '@nestjs/jwt'
import {LocalStrategy} from './strategies/local.strategy'
import {JwtStrategy} from './strategies/jwt.strategy'
import {LoggerMiddleware} from '@app/common/utils/middlewares/logger.middleware'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['./apps/auth/.env'],
            validationSchema: Joi.object({
                PORT: Joi.number().required(),

                MARIADB_HOST: Joi.string().required(),
                MARIADB_USERNAME: Joi.string().required(),
                MARIADB_PASSWORD: Joi.string().required(),
                MARIADB_DATABASE: Joi.string().required(),
                MARIADB_PORT: Joi.number().required(),

                MONGO_URI: Joi.string().required(),
                MONGO_DATABASE: Joi.string().required(),

                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),

                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION: Joi.number().required(),

                MAIL_HOST: Joi.string().required(),
                MAIL_PORT: Joi.number().required(),
                MAIL_USER: Joi.string().required(),
                MAIL_PASS: Joi.string().required(),
            }),
        }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get<number>('JWT_EXPIRATION')}s`,
                },
            }),
            inject: [ConfigService],
        }),
        MariaModule,
        RabbitMQModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('/')
    }
}
