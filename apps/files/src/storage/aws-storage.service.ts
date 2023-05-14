import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common'
import {StorageService} from './abstract-storage'
import {ConfigService} from '@nestjs/config'
import {config} from 'aws-sdk'
import {S3} from 'aws-sdk'
import {File} from '@app/common/maria/entity/file.entity'

@Injectable()
export class AwsStorageService extends StorageService {
    protected readonly logger = new Logger(AwsStorageService.name)
    protected readonly client

    constructor(private readonly configService: ConfigService) {
        super()

        config.update({
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
            region: this.configService.get<string>('AWS_REGION'),
        })

        this.client = new S3()
    }

    public getCredentials() {
        throw new InternalServerErrorException('not implemented')
        return {}
    }

    public async putObject(file: Express.Multer.File, objectName: string) {
        throw new InternalServerErrorException('not implemented')
        return {}
    }

    public async getObject(file: File) {
        throw new InternalServerErrorException('not implemented')
        return {}
    }

    public async getUrl(file: File) {
        throw new InternalServerErrorException('not implemented')
        return ''
    }

    public async deleteObject(...args: any) {
        throw new InternalServerErrorException('not implemented')
        return {}
    }
}
