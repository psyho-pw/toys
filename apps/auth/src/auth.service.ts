import {Injectable} from '@nestjs/common'
import {UserRepository} from './user.repository'
import {User, UserExcludeCredentials} from './schema/user.schema'
import {Types} from 'mongoose'
import {plainToInstance} from 'class-transformer'

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}
    async createUser() {
        const user = new User()
        user.email = 'fishcreek@naver.com'
        user.name = 'sayho'
        return this.userRepository.create(user)
    }

    async findOne(userId: string) {
        return this.userRepository.findOne({_id: new Types.ObjectId(userId)}).then(e => plainToInstance(UserExcludeCredentials, e))
    }
}
