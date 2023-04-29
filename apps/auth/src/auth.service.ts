import {Injectable} from '@nestjs/common'
import {UserMongoRepository} from './user-mongo.repository'
import {User, UserExcludeCredentials} from './schema/user.schema'
import {User as UserEntity} from '@app/common/maria/entity/user.entity'
import {Types} from 'mongoose'
import {plainToInstance} from 'class-transformer'
import {UserMariaRepository} from './user-maria.repository'

@Injectable()
export class AuthService {
    constructor(private readonly userMongoRepository: UserMongoRepository, private readonly userMariaRepository: UserMariaRepository) {}
    async createUserViaMongo() {
        const user = new User()
        user.email = 'fishcreek@naver.com'
        user.name = 'sayho'
        return this.userMongoRepository.create(user)
    }

    async createUserViaMaria() {
        const user = new UserEntity()
        user.email = 'fishcreek@naver.com'
        user.name = 'sayho'
        return this.userMariaRepository.create(user)
    }

    async findOneViaMongo(userId: string) {
        return this.userMongoRepository.findOne({_id: new Types.ObjectId(userId)}).then(e => plainToInstance(UserExcludeCredentials, e))
    }

    async findOneViaMaria(id: number) {
        return this.userMariaRepository.findOneById(id)
    }

    async test() {
        return this.userMariaRepository.findByCondition({id: 1})
    }
}
