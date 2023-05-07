import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import {FilesController} from './files.controller'
import {FilesService} from './files.service'
import {ConfigModule} from '@nestjs/config'
import * as Joi from 'joi'
import {AUTH_SERVICE, AuthModule, HealthModule, MariaModule, RabbitMQModule} from '@app/common'
import {NotificationModule} from '@app/notification'
import {LoggerMiddleware} from '@app/common/utils/middlewares/logger.middleware'
import {FilesRepository} from './fiiles.repository'
import {TypeOrmModule} from '@nestjs/typeorm'
import {File} from '@app/common/maria/entity/file.entity'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['./apps/files/.env'],
            validationSchema: Joi.object({
                PORT: Joi.number().required(),

                MARIADB_HOST: Joi.string().required(),
                MARIADB_USERNAME: Joi.string().required(),
                MARIADB_PASSWORD: Joi.string().required(),
                MARIADB_DATABASE: Joi.string().required(),
                MARIADB_PORT: Joi.number().required(),

                RABBIT_MQ_URI: Joi.string().required(),
                RABBIT_MQ_FILES_QUEUE: Joi.string().required(),
                RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),

                DISCORD_WEBHOOK_URL: Joi.string().required(),

                OCI_CONFIG_PATH: Joi.string().required(),
                OCI_CONFIG_PROFILE: Joi.string().required(),
                OCI_OS_BUCKET_NAME: Joi.string().required(),
            }),
        }),
        MariaModule,
        TypeOrmModule.forFeature([File]),
        RabbitMQModule.register({name: AUTH_SERVICE}),
        AuthModule,
        HealthModule,
        NotificationModule,
    ],
    controllers: [FilesController],
    providers: [FilesService, FilesRepository],
})
export class FilesModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('/')
    }
}
