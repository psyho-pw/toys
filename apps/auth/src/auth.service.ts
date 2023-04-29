import {Injectable, Logger} from '@nestjs/common'
import {UserMongoRepository} from './user-mongo.repository'
import {User, UserExcludeCredentials} from '@app/common/maria/entity/user.entity'
import {Types} from 'mongoose'
import {plainToInstance} from 'class-transformer'
import {UserMariaRepository} from './user-maria.repository'

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(private readonly userMongoRepository: UserMongoRepository, private readonly userMariaRepository: UserMariaRepository) {}
    // public async createUserViaMongo(createUserDto: CreateUserDto) {
    //     const user = new User()
    //     user.email = createUserDto.email
    //     user.name = createUserDto.name
    //     await user.setPassword(createUserDto.password)
    //
    //     return plainToInstance(UserExcludeCredentialsMongo, await this.userMongoRepository.create(user))
    // }
    //
    // public async createUserViaMaria(createUserDto: CreateUserDto) {
    //     const user = new UserEntity()
    //     user.email = createUserDto.email
    //     user.name = createUserDto.name
    //     await user.setPassword(createUserDto.password)
    //
    //     return plainToInstance(UserExcludeCredentialsMaria, await this.userMariaRepository.create(user))
    // }

    public async createUser(data: any) {
        this.logger.log('Auth ...', data)
    }

    // public async findOneViaMongo(userId: string) {
    //     return this.userMongoRepository.findOne({_id: new Types.ObjectId(userId)}).then(e => plainToInstance(UserExcludeCredentialsMongo, e))
    // }
    //
    // public async findOneViaMaria(id: number) {
    //     return this.userMariaRepository.findOneById(id).then(e => plainToInstance(UserExcludeCredentialsMaria, e))
    // }
}
