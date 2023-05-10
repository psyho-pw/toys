import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import {FilesService} from './files.service'
import {AnyFilesInterceptor} from '@nestjs/platform-express'
import {CurrentUser, JwtAuthGuard} from '@app/common'
import {User} from '@app/common/maria/entity/user.entity'
import stream from 'stream'
import type {Response} from 'express'

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
    async findOne(@Param('id') id: number, @Res({passthrough: true}) res: Response) {
        const {stream: readableStream, file} = await this.filesService.findOne(id)

        //! transform web stream into Uint8Array
        // const reader = readableStream.getReader()
        // let ret: Uint8Array = new Uint8Array()
        // while (true) {
        //     const {done, value} = await reader.read()
        //     if (done) break
        //     ret = new Uint8Array([...ret, ...value])
        // }

        //! Stability 1 - experimental
        // @ts-ignore
        const nodeStream = stream.Readable.fromWeb(readableStream)

        res.set({
            'Content-Type': file.mimeType,
            'Content-Disposition': `attachment; filename="${file.originalName}"`,
        })

        return new StreamableFile(nodeStream)
    }

    @Delete('/:id')
    deleteOne(@Param('id') id: number) {
        return this.filesService.deleteOne(id)
    }
}
