import {Controller, Logger, Post, Res, UseGuards} from '@nestjs/common'
import {AuthService} from './auth.service'
import {ConfigService} from '@nestjs/config'
import {Ctx, EventPattern, MessagePattern, Payload, RmqContext} from '@nestjs/microservices'
import {RabbitMQService} from '@app/common'
import {User} from '@app/common/maria/entity/user.entity'
import {CurrentUser} from './current-user.decorator'
import {Response} from 'express'
import JwtAuthGuard from './guards/jwt-auth.guard'
import {LocalAuthGuard} from './guards/local-auth.guard'

@Controller('/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)
    constructor(private readonly configService: ConfigService, private readonly authService: AuthService, private readonly rabbitMQService: RabbitMQService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/')
    async signIn(@CurrentUser() user: User, @Res({passthrough: true}) response: Response) {
        await this.authService.signIn(user, response)
        response.send(user)
    }

    @UseGuards(JwtAuthGuard)
    @MessagePattern('validate_user')
    async validateUser(@CurrentUser() user: User) {
        this.logger.verbose(user)
        return user
    }

    @UseGuards(JwtAuthGuard)
    @EventPattern('message')
    async handleMessage(@Payload() data: any, @Ctx() context: RmqContext) {
        await this.authService.handleMessage(data)
        this.rabbitMQService.sendAck(context)
    }
}
