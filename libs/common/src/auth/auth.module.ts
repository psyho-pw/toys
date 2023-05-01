import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import cookieParser from 'cookie-parser'
import {RabbitMQModule} from '../rabbitMQ/rabbitMQ.module'
import {AUTH_SERVICE} from '@app/common/services'

@Module({
    imports: [RabbitMQModule.register({name: AUTH_SERVICE})],
    exports: [RabbitMQModule],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*')
    }
}
