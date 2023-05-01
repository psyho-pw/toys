import {Injectable, UnauthorizedException, UnprocessableEntityException} from '@nestjs/common'
import {UserRepository} from './user.repository'
import {CreateUserDto} from './dto/create-user.dto'
import {User, UserExcludeCredentials} from '@app/common/maria/entity/user.entity'
import {plainToInstance} from 'class-transformer'
import {MailService} from '@app/mail'

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly mailService: MailService) {}

    public async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userRepository.findOneByCondition({email: createUserDto.email})
        if (existingUser) throw new UnprocessableEntityException('user already exists')

        const user = new User()
        user.email = createUserDto.email
        user.name = createUserDto.name
        await user.setPassword(createUserDto.password)

        return plainToInstance(UserExcludeCredentials, await this.userRepository.create(user))
    }

    public async validate(email: string, password: string) {
        const user = await this.userRepository.findOneByCondition({email})
        const isValidPassword = await user.validatePassword(password)
        if (!isValidPassword) throw new UnauthorizedException('credentials are not valid')

        return user
    }

    public async findOne(id: number) {
        await this.mailService.sendSingle({
            to: 'fishcreek@naver.com',
            subject: 'Testing Mailer module',
            template: 'activation_code.html',
            context: {
                // Data to be sent to template engine.
                code: 'cf1a3f828287',
                username: 'john doe',
            },
        })
        return this.userRepository.findOneById(id)
    }
}
