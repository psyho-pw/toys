import {Controller, Delete, Get, Param, Post, Res, StreamableFile, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common'
import {FilesService} from './files.service'
import {AnyFilesInterceptor} from '@nestjs/platform-express'
import {CurrentUser, JwtAuthGuard} from '@app/common'
import {User} from '@app/common/maria/entity/user.entity'

@UseGuards(JwtAuthGuard)
@Controller()
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get('/credentials')
    getCredentials() {
        return this.filesService.getCredentials()
    }

    @Post('/')
    @UseInterceptors(AnyFilesInterceptor())
    upload(@UploadedFiles() files: Array<Express.Multer.File>, @CurrentUser() user: User) {
        return this.filesService.createMany(files, user)
    }

    @Get('/:id')
    async findOne(@Param('id') id: number, @Res() res: Response) {
        const readableStream = await this.filesService.findOne(id)
        console.log(readableStream)
    }

    @Delete('/:id')
    deleteOne(@Param('id') id: number) {
        return this.filesService.deleteOne(id)
    }
}
