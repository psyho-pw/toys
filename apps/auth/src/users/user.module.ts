import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from '@app/common/maria/entity/user.entity'
import {UserController} from './user.controller'
import {UserService} from './user.service'
import {UserRepository} from './user.repository'
import {MailModule} from '@app/mail'

@Module({
    imports: [TypeOrmModule.forFeature([User]), MailModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
