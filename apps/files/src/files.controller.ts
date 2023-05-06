import {Controller, Get} from '@nestjs/common'
import {FilesService} from './files.service'

@Controller()
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get()
    getCredentials() {
        return this.filesService.getCredentials()
    }
}
