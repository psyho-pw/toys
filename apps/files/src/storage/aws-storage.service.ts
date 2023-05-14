import {Injectable, Logger} from '@nestjs/common'
import {StorageService} from './abstract-storage'
import {ConfigService} from '@nestjs/config'
import {S3} from 'aws-sdk'
import {File} from '@app/common/maria/entity/file.entity'

@Injectable()
export class AwsStorageService extends StorageService {
    protected readonly logger = new Logger(AwsStorageService.name)
    protected readonly client
    private readonly bucketName: string

    constructor(private readonly configService: ConfigService) {
        super()

        this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME')
        this.client = new S3({
            accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get<string>('AWS_REGION'),
        })
    }

    public getCredentials(): Record<string, any> {
        return this.client.config
    }

    public async putObject(file: Express.Multer.File, objectName: string) {
        const putObjectRequest: S3.Types.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: objectName,
            Body: file.buffer,
        }

        return this.client.upload(putObjectRequest).promise()
    }

    public async getObject(file: File) {
        const getObjectRequest: S3.Types.GetObjectRequest = {
            Bucket: this.bucketName,
            Key: file.objectName,
        }

        return this.client.getObject(getObjectRequest).promise()
    }

    private async getPreSignedUrl(file: File) {
        return this.client.getSignedUrlPromise('getObject', {
            Bucket: this.bucketName,
            Key: file.objectName,
            Expires: 60 * 60 * 24,
        })
    }

    public async getUrl(file: File) {
        return this.getPreSignedUrl(file)
    }

    public async deleteObject(file: File) {
        const deleteObjectRequest: S3.Types.DeleteObjectRequest = {
            Bucket: this.bucketName,
            Key: file.objectName,
        }

        return this.client.deleteObject(deleteObjectRequest).promise()
    }
}
