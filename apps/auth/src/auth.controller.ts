import {Controller, Get, Param} from '@nestjs/common'
import {AuthService} from './auth.service'

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/')
    createUser() {
        return this.authService.createUser()
    }

    @Get('/:userId')
    findUser(@Param('userId') userId: string) {
        return this.authService.findOne(userId)
    }
}
