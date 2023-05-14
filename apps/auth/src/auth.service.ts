import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {JwtService} from '@nestjs/jwt'
import {User} from '@app/common/maria/entity/user.entity'
import {Response} from 'express'
import {RmqContext} from '@nestjs/microservices'

export interface TokenPayload {
    userId: number
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    public async signIn(user: User, response: Response) {
        const tokenPayload: TokenPayload = {
            userId: user.id,
        }

        const expires = new Date()
        expires.setSeconds(expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION'))

        const token = this.jwtService.sign(tokenPayload)

        response.cookie('Authentication', token, {
            httpOnly: true,
            expires,
        })
    }

    public signOut(response: Response) {
        response.cookie('Authentication', '', {httpOnly: true, expires: new Date()})
    }

    public async handleMessage(data: any, context: RmqContext) {
        this.logger.debug(data.request)
        return data.request
    }
}
