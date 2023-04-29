import {Controller} from '@nestjs/common'
import {AuthService} from './auth.service'
import {ConfigService} from '@nestjs/config'
import {Ctx, EventPattern, Payload, RmqContext} from '@nestjs/microservices'
import {RabbitMQService} from '@app/common'

@Controller()
export class AuthController {
    constructor(private readonly configService: ConfigService, private readonly authService: AuthService, private readonly rabbitMQService: RabbitMQService) {}

    @EventPattern('create_user')
    async handleCreateUser(@Payload() data: any, @Ctx() context: RmqContext) {
        await this.authService.createUser(data)
        this.rabbitMQService.sendAck(context)
    }
    // @Post('/')
    // async createUser(@Body() createUserDto: CreateUserDto) {
    //     console.log(createUserDto)
    //     // await this.authService.createUserViaMongo(createUserDto)
    //     return this.authService.createUserViaMaria(createUserDto)
    // }
    //
    // @Get('/:userId')
    // findUser(@Param('userId') userId: string) {
    //     console.log(this.rabbitMQService.getOptions('auth'))
    //     // return this.authService.findOneViaMongo(userId)
    //     return this.authService.findOneViaMaria(+userId)
    // }
}
