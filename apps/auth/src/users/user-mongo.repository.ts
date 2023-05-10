import {Injectable, Logger} from '@nestjs/common'
import {AbstractMongoRepository} from '@app/common'
import {User} from './schema/user.schema'
import {InjectConnection, InjectModel} from '@nestjs/mongoose'
import {Connection, Model} from 'mongoose'

@Injectable()
export class UserMongoRepository extends AbstractMongoRepository<User> {
    protected readonly logger = new Logger(UserMongoRepository.name)

    constructor(
        @InjectModel(User.name) userModel: Model<User>,
        @InjectConnection() connection: Connection,
    ) {
        super(userModel, connection)
    }
}
