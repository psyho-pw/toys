import {Injectable, Logger} from '@nestjs/common'
import {StorageService} from './abstract-storage'
import {ConfigService} from '@nestjs/config'
import path from 'path'
import {ConfigFileReader} from 'oci-common'
import {ConfigFileAuthenticationDetailsProvider} from 'oci-sdk'
import {ObjectStorageClient, models, requests, responses} from 'oci-objectstorage'
import {ConfigFile} from 'oci-common/lib/config-file-reader'
import {File} from '@app/common/maria/entity/file.entity'
import {Bucket} from 'oci-objectstorage/lib/model'
import {Types} from 'mongoose'

@Injectable()
export class OracleStorageService extends StorageService {
    protected readonly logger = new Logger(OracleStorageService.name)

    private readonly config: ConfigFile
    private readonly profile: Map<string, string>
    private readonly provider: ConfigFileAuthenticationDetailsProvider

    private readonly compartmentId
    private readonly serviceName
    private readonly regionId
    private readonly secondLevelDomain

    protected readonly client
    private nameSpace: string
    private bucket: Bucket

    constructor(private readonly configService: ConfigService) {
        super()
        const configFilePath = path.resolve(this.configService.get<string>('OCI_CONFIG_PATH'))
        const configProfile = this.configService.get<string>('OCI_CONFIG_PROFILE')

        this.compartmentId = this.configService.get<string>('OCI_COMPARTMENT_ID')
        this.serviceName = this.configService.get<string>('OCI_SERVICE_NAME')
        this.regionId = this.configService.get<string>('OCI_SERVICE_NAME_OBJECTSTORAGE')
        this.secondLevelDomain = this.configService.get<string>('OCI_SECOND_LEVEL_DOMAIN')

        this.config = ConfigFileReader.parseFileFromPath(configFilePath, configProfile)
        this.profile = this.config.accumulator.configurationsByProfile.get(configProfile)
        this.provider = new ConfigFileAuthenticationDetailsProvider(configFilePath, configProfile)

        this.client = new ObjectStorageClient({authenticationDetailsProvider: this.provider})
        this.getNamespace()
            .then(async () => {
                await this.getBucket()
            })
            .then(() => this.logger.verbose('✅  oci sdk initialized'))
    }

    private async getNamespace() {
        const request: requests.GetNamespaceRequest = {}
        const response = await this.client.getNamespace(request)
        this.nameSpace = response.value
    }

    private async createBucket(name: string) {
        const createBucketDetails: models.CreateBucketDetails = {
            name,
            compartmentId: this.compartmentId,
        }
        const createBucketRequest: requests.CreateBucketRequest = {
            namespaceName: this.nameSpace,
            createBucketDetails,
        }

        return this.client.createBucket(createBucketRequest)
    }

    private async getBucket() {
        const getBucketRequest: requests.GetBucketRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.configService.get<string>('OCI_OS_BUCKET_NAME'),
        }
        const resp = await this.client.getBucket(getBucketRequest)
        this.bucket = resp.bucket
    }

    private async deleteBucket(name: string) {
        const deleteBucketRequest: requests.DeleteBucketRequest = {
            namespaceName: this.nameSpace,
            bucketName: name,
        }
        return this.client.deleteBucket(deleteBucketRequest)
    }

    public getCredentials(): Record<string, string> {
        return Object.fromEntries(this.profile)
    }

    public async putObject(
        file: Express.Multer.File,
        objectName: string,
    ): Promise<responses.PutObjectResponse> {
        const request: requests.PutObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.name,
            putObjectBody: file.buffer,
            objectName,
            contentLength: file.size,
        }

        return this.client.putObject(request)
    }

    public async getObject(file: File): Promise<responses.GetObjectResponse> {
        const request: requests.GetObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.name,
            objectName: file.objectName,
        }

        return this.client.getObject(request)
    }

    private async getPAR(file: File) {
        const expire = new Date()
        expire.setDate(expire.getDate() + 1)
        this.logger.debug('expire:', expire)

        const createPreauthenticatedRequestDetails: models.CreatePreauthenticatedRequestDetails = {
            name: new Types.ObjectId().toString(),
            objectName: file.objectName,
            accessType: models.CreatePreauthenticatedRequestDetails.AccessType.ObjectRead,
            timeExpires: expire,
        }

        const createPreauthenticatedRequest: requests.CreatePreauthenticatedRequestRequest = {
            bucketName: this.bucket.name,
            namespaceName: this.nameSpace,
            createPreauthenticatedRequestDetails,
        }

        const resp = await this.client.createPreauthenticatedRequest(createPreauthenticatedRequest)

        const baseUrl = `https://${this.serviceName}.${this.regionId}.${this.secondLevelDomain}`
        const downloadUrl = resp.preauthenticatedRequest.accessUri

        return baseUrl + downloadUrl
    }

    public async getUrl(file: File) {
        return this.getPAR(file)
    }

    public async deleteObject(file: File) {
        const deleteObjectRequest: requests.DeleteObjectRequest = {
            namespaceName: this.nameSpace,
            bucketName: this.bucket.name,
            objectName: file.objectName,
        }

        return this.client.deleteObject(deleteObjectRequest)
    }
}
