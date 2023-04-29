import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import * as process from 'process'
import {User} from '@app/common/maria/entity/user.entity'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'mariadb',
                host: configService.get<string>('MARIADB_HOST'),
                port: configService.get<number>('MARIADB_PORT'),
                username: configService.get<string>('MARIADB_USERNAME'),
                password: configService.get<string>('MARIADB_PASSWORD'),
                database: configService.get<string>('MARIADB_DATABASE'),
                synchronize: process.env.NODE_ENV === 'development',
                dropSchema: false,
                logging: process.env.NODE_ENV === 'development',
                entities: [User],
                keepConnectionAlive: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class MariaModule {}
