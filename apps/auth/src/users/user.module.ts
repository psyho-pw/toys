import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from '@app/common/maria/entity/user.entity'
import {UserController} from './user.controller'
import {UserService} from './user.service'
import {UserRepository} from './user.repository'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
