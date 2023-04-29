import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {UserService} from '../users/user.service'
import {TokenPayload} from '../auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => {
                    return request?.Authentication
                },
            ]),
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate({userId}: TokenPayload) {
        try {
            return await this.userService.findOne(userId)
        } catch (err) {
            throw new UnauthorizedException()
        }
    }
}
