import {AbstractMariaRepository} from '@app/common'
import {User} from '@app/common/maria/entity/user.entity'
import {Injectable, Logger} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

@Injectable()
export class UserRepository extends AbstractMariaRepository<User> {
    protected readonly logger: Logger

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {
        super(usersRepository)
    }
}
