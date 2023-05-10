import {Injectable, Logger} from '@nestjs/common'
import {AbstractStorage} from '../common/abstract-storage'
import {ConfigService} from '@nestjs/config'
import path from 'path'
import {ConfigFileReader} from 'oci-common'
import {ConfigFileAuthenticationDetailsProvider} from 'oci-sdk'
import {ObjectStorageClient, requests, responses} from 'oci-objectstorage'
import {ConfigFile} from 'oci-common/lib/config-file-reader'
import {Types} from 'mongoose'
import {File} from '@app/common/maria/entity/file.entity'

@Injectable()
export class OracleStorageService extends AbstractStorage {
    private readonly logger = new Logger(OracleStorageService.name)
    private readonly config: ConfigFile
    private readonly profile: Map<string, string>
    private readonly provider: ConfigFileAuthenticationDetailsProvider

    private readonly objectStorageClient
    private nameSpace: string
    private bucket: responses.GetBucketResponse
    constructor(private readonly configService: ConfigService) {
        super()
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

    getCredentials(): Record<string, string> {
        return Object.fromEntries(this.profile)
    }

    async putObject(file: Express.Multer.File, objectName: string): Promise<responses.PutObjectResponse> {
        const request: requests.PutObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.bucket.name,
            putObjectBody: file.buffer,
            objectName,
            contentLength: file.size,
        }

        return this.objectStorageClient.putObject(request)
    }

    async getObject(file: File): Promise<responses.GetObjectResponse> {
        const request: requests.GetObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.bucket.name,
            objectName: file.objectName,
        }

        return this.objectStorageClient.getObject(request)
    }
    async deleteObject(file: File) {
        const deleteObjectRequest: requests.DeleteObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.bucket.name,
            objectName: file.objectName,
        }

        return this.objectStorageClient.deleteObject(deleteObjectRequest)
    }
}
