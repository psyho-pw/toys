import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {Strategy} from 'passport-local'
import {UserService} from '../users/user.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({usernameField: 'email'})
    }

    async validate(email: string, password: string) {
        return this.userService.validate(email, password)
    }
}
