import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import path from 'path'
import {ConfigFileReader} from 'oci-common'
import {ConfigFile} from 'oci-common/lib/config-file-reader'
import {ConfigFileAuthenticationDetailsProvider} from 'oci-sdk'
import {ObjectStorageClient, requests, responses} from 'oci-objectstorage'
import {FilesRepository} from './fiiles.repository'
import {File} from '@app/common/maria/entity/file.entity'
import {Types} from 'mongoose'
import {User} from '@app/common/maria/entity/user.entity'
import * as stream from 'stream'

@Injectable()
export class FilesService {
    private readonly logger = new Logger(FilesService.name)
    private readonly config: ConfigFile
    private readonly profile: Map<string, string>
    private readonly provider: ConfigFileAuthenticationDetailsProvider

    private readonly objectStorageClient
    private nameSpace: string
    private bucket: responses.GetBucketResponse

    constructor(private readonly configService: ConfigService, private readonly filesRepository: FilesRepository) {
        const configFilePath = path.resolve(this.configService.get<string>('OCI_CONFIG_PATH'))
        const configProfile = this.configService.get<string>('OCI_CONFIG_PROFILE')

        this.config = ConfigFileReader.parseFileFromPath(configFilePath, configProfile)
        this.profile = this.config.accumulator.configurationsByProfile.get(configProfile)
        this.provider = new ConfigFileAuthenticationDetailsProvider(configFilePath, configProfile)

        this.objectStorageClient = new ObjectStorageClient({authenticationDetailsProvider: this.provider})
        this.getNamespace()
            .then(async () => {
                await this.getBucket()
            })
            .then(() => this.logger.verbose('✅  oci sdk initialized'))
    }

    private async getNamespace() {
        const request: requests.GetNamespaceRequest = {}
        const response = await this.objectStorageClient.getNamespace(request)
        this.nameSpace = response.value
    }

    private async getBucket() {
        const getBucketRequest: requests.GetBucketRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.configService.get<string>('OCI_OS_BUCKET_NAME'),
        }
        this.bucket = await this.objectStorageClient.getBucket(getBucketRequest)
    }

    async getCredentials() {
        return Object.fromEntries(this.profile)
    }

    async createMany(files: Array<Express.Multer.File>, requestUser: User) {
        return Promise.all(files.map(async file => await this.createOne(file, requestUser)))
    }

    async createOne(file: Express.Multer.File, requestUser: User) {
        const objectName = new Types.ObjectId().toString()
        const request: requests.PutObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.bucket.name,
            putObjectBody: file.buffer,
            objectName,
            contentLength: file.size,
        }
        const uploadResult = await this.objectStorageClient.putObject(request)

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

    private streamToString(stream: ReadableStream) {
        let output = ''
        stream.on('data', data => {
            output += data.toString()
        })
        stream.on('end', () => {
            return output
        })
    }
    async findOne(id: number) {
        const file = await this.filesRepository.findOneById(id)
        const request: requests.GetObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.bucket.name,
            objectName: file.objectName,
        }

        const result = await this.objectStorageClient.getObject(request)
        const stream = result.value as ReadableStream
        console.log(stream.locked)
        return this.streamToString(stream)

        // return result.value as stream.Readable
    }

    async deleteOne(id: number) {
        const file = await this.filesRepository.findOneById(id)
        const deleteObjectRequest: requests.DeleteObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.bucket.name,
            objectName: file.objectName,
        }
        const deleteResult = await this.objectStorageClient.deleteObject(deleteObjectRequest)
        this.logger.debug(deleteResult)
        return this.filesRepository.remove(id)
    }
}
