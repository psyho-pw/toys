import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common'
import {AbstractStorage} from '../common/abstract-storage'
import {ConfigService} from '@nestjs/config'
import {config} from 'aws-sdk'
import {S3} from 'aws-sdk'
import {File} from '@app/common/maria/entity/file.entity'

@Injectable()
export class AwsStorageService extends AbstractStorage {
    protected readonly logger = new Logger(AwsStorageService.name)
    protected readonly client

    constructor(private readonly configService: ConfigService) {
        super()

        config.update({
            credentials: {accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'), secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')},
            region: this.configService.get<string>('AWS_REGION'),
        })

        this.client = new S3()
    }

    deleteObject(...args: any): Record<string, any> {
        throw new InternalServerErrorException('not implemented')
    }

    getCredentials(): Record<string, string> {
        throw new InternalServerErrorException('not implemented')
    }

    getObject(file: File): Record<string, any> {
        throw new InternalServerErrorException('not implemented')
    }

    putObject(file: Express.Multer.File, objectName: string): Record<string, any> {
        throw new InternalServerErrorException('not implemented')
    }
}
