import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'
import cookieParser from 'cookie-parser'
import {RabbitMQModule} from '@app/common'
import {FILES_SERVICE} from '@app/common/services'

@Module({
    imports: [RabbitMQModule.register({name: FILES_SERVICE})],
    exports: [RabbitMQModule],
})
export class FilesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser()).forRoutes('*')
    }
}
