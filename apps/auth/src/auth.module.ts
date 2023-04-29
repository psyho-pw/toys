import {Module} from '@nestjs/common'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {ConfigModule} from '@nestjs/config'
// import Joi from 'joi'
import {MongoModule} from '@app/common'
import * as Joi from 'joi'
import {MongooseModule} from '@nestjs/mongoose'
import {User, UserSchema} from './schema/user.schema'
import {UserRepository} from './user.repository'

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
            }),
        }),
        MongoModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserRepository],
})
export class AuthModule {}
