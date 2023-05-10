import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {FilesRepository} from './fiiles.repository'
import {File} from '@app/common/maria/entity/file.entity'
import {Types} from 'mongoose'
import {User} from '@app/common/maria/entity/user.entity'
import {OracleStorageService} from './storage/oracle-storage.service'

@Injectable()
export class FilesService {
    private readonly logger = new Logger(FilesService.name)

    constructor(
        private readonly configService: ConfigService,
        private readonly filesRepository: FilesRepository,
        private readonly storageService: OracleStorageService,
    ) {}

    async getCredentials() {
        return this.storageService.getCredentials()
    }

    async createMany(files: Array<Express.Multer.File>, requestUser: User) {
        return Promise.all(files.map(async file => await this.createOne(file, requestUser)))
    }

    async createOne(file: Express.Multer.File, requestUser: User) {
        const objectName = new Types.ObjectId().toString()
        const uploadResult = await this.storageService.putObject(file, objectName)

        const fileEntity = new File()
        fileEntity.objectName = objectName
        fileEntity.originalName = file.originalname
        fileEntity.mimeType = file.mimetype
        fileEntity.size = file.size
        fileEntity.opcRequestId = uploadResult.opcRequestId
        fileEntity.opcContentMd5 = uploadResult.opcContentMd5
        fileEntity.eTag = uploadResult.eTag
        fileEntity.versionId = uploadResult.versionId
        fileEntity.createdBy = requestUser

        return this.filesRepository.create(fileEntity)
    }

    async findOne(id: number) {
        const file = await this.filesRepository.findOneById(id)
        const result = await this.storageService.getObject(file)

        return {
            stream: result.value as ReadableStream,
            file,
        }
    }

    async deleteOne(id: number) {
        const file = await this.filesRepository.findOneById(id)
        const deleteResult = await this.storageService.deleteObject(file)

        this.logger.debug(deleteResult)
        return this.filesRepository.remove(id)
    }
}
