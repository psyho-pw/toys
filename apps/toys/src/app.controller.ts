import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common'
import {AppService} from './app.service'
import {CreateUserDto} from './dto/create-user.dto'
import {JwtAuthGuard} from '@app/common'
import {ConfigService} from '@nestjs/config'

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly configService: ConfigService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/test')
    async createUser(@Body() createUserDto: CreateUserDto, @Req() req: any) {
        return this.appService.createUser(createUserDto, req.cookies?.Authentication)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/files/:id')
    async testFile(@Param('id') id: number, @Req() req: any) {
        return this.appService.testFiles(id, req.cookies?.Authentication)
    }
}
