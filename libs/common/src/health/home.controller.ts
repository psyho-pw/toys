import {Controller, Get} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

@Controller('/')
export class HomeController {
    constructor(private readonly configService: ConfigService) {}

    @Get('/')
    home() {
        return `listening on port ${this.configService.get<number>('PORT')}`
    }
}
