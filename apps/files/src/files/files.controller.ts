import {
    Controller,
    Delete,
    Get,
    Logger,
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
import {CurrentUser, JwtAuthGuard, RabbitMQService} from '@app/common'
import {User} from '@app/common/maria/entity/user.entity'
import stream from 'stream'
import type {Response} from 'express'
import {Ctx, EventPattern, MessagePattern, Payload, RmqContext} from '@nestjs/microservices'
import {Observable, Subscriber} from 'rxjs'

@UseGuards(JwtAuthGuard)
@Controller()
export class FilesController {
    private readonly logger = new Logger(FilesController.name)

    constructor(
        private readonly filesService: FilesService,
        private readonly rabbitMQService: RabbitMQService,
    ) {}

    @Get('/credentials')
    getCredentials() {
        return this.filesService.getCredentials()
    }

    @EventPattern('get-file')
    async test(
        // @CurrentUser() user: User,
        @Payload() data: {id: number},
        @Ctx() context: RmqContext,
    ) {
        return new Observable((observer: Subscriber<string>) => {
            this.filesService.findOneUrl(data.id).then(res => {
                observer.next(res)
                observer.complete()
            })
        })

        // return this.filesService.findOneUrl(data.id).pipe(tap(res => res))
        // return user.pipe(tap())
        // this.rabbitMQService.sendAck(context)
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

    @Get('/:id/url')
    async findOneUrl(@Param('id') id: number) {
        return this.filesService.findOneUrl(id)
    }

    @Delete('/:id')
    deleteOne(@Param('id') id: number) {
        return this.filesService.deleteOne(id)
    }
}
