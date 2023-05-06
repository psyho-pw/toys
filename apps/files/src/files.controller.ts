import {Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors} from '@nestjs/common'
import {FilesService} from './files.service'
import {AnyFilesInterceptor} from '@nestjs/platform-express'

@Controller()
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get('/credentials')
    getCredentials() {
        return this.filesService.getCredentials()
    }

    @Post('/')
    @UseInterceptors(AnyFilesInterceptor())
    upload(@UploadedFiles() files: Array<Express.Multer.File>) {
        return this.filesService.createMany(files)
    }

    @Get('/:id')
    findOne(@Param('id') id: number) {
        return this.filesService.findOne(id)
    }

    @Delete('/:id')
    deleteOne(@Param('id') id: number) {
        return this.filesService.deleteOne(id)
    }
}
