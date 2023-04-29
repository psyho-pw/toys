import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {ConfigService} from '@nestjs/config'

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
                dbName: configService.get<string>('MONGO_DATABASE'),
            }),
            inject: [ConfigService],
        }),
    ],
})
export class MongoModule {}
