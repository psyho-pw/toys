import {DynamicModule, Module} from '@nestjs/common'
import {RabbitMQService} from '@app/common/rabbitMQ/rabbitMQ.service'
import {ClientsModule, Transport} from '@nestjs/microservices'
import {ConfigService} from '@nestjs/config'

interface RabbitMQOptions {
    name: string
}

@Module({
    providers: [RabbitMQService],
    exports: [RabbitMQService],
})
export class RabbitMQModule {
    static register({name}: RabbitMQOptions): DynamicModule {
        return {
            module: RabbitMQModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name,
                        useFactory: (configService: ConfigService) => ({
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBIT_MQ_URI')],
                                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                            },
                        }),
                        inject: [ConfigService],
                    },
                ]),
            ],
            exports: [ClientsModule],
        }
    }
}
