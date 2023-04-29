import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common'
import {AppService} from './app.service'
import {CreateUserDto} from './dto/create-user.dto'
import {JwtAuthGuard} from '@app/common'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async createUser(@Body() createUserDto: CreateUserDto, @Req() req: any) {
        return this.appService.createUser(createUserDto, req.cookies?.Authentication)
    }
}
