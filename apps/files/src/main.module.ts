import {ConfigModule} from '@nestjs/config'
import * as Joi from 'joi'
import {HealthModule, MariaModule, RabbitMQModule} from '@app/common'
import {NotificationModule} from '@app/notification'
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import {LoggerMiddleware} from '@app/common/utils/middlewares/logger.middleware'
import {FilesModule} from './files/files.module'

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
                OCI_BUCKET_NAME: Joi.string().required(),
                OCI_COMPARTMENT_ID: Joi.string().required(),
                OCI_SERVICE_NAME_OBJECTSTORAGE: Joi.string().required(),
                OCI_REGION_ID: Joi.string().required(),
                OCI_SECOND_LEVEL_DOMAIN: Joi.string().required(),

                AWS_ACCESS_KEY_ID: Joi.string().required(),
                AWS_SECRET_ACCESS_KEY: Joi.string().required(),
                AWS_REGION: Joi.string().required(),
                AWS_BUCKET_NAME: Joi.string().required(),
            }),
        }),
        MariaModule,
        RabbitMQModule,
        HealthModule,
        NotificationModule,
        FilesModule,
    ],
})
export class MainModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('/')
    }
}
