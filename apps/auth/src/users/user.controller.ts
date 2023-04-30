import {Body, Controller, Get, Param, Post} from '@nestjs/common'
import {UserService} from './user.service'
import {CreateUserDto} from './dto/create-user.dto'

@Controller('/auth/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Get('/:id')
    findById(@Param('id') id: number) {
        return this.userService.findOne(id)
    }
}
