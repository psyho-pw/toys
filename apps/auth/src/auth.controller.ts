import {Controller, Get, Param, Post} from '@nestjs/common'
import {AuthService} from './auth.service'

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/')
    createUser() {
        // return this.authService.createUserViaMongo()
        return this.authService.createUserViaMaria()
    }

    @Get('/:userId')
    findUser(@Param('userId') userId: string) {
        // return this.authService.findOneViaMongo(userId)
        return this.authService.findOneViaMaria(+userId)
    }
}
