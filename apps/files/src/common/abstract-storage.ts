import {Logger} from '@nestjs/common'
import {File} from '@app/common/maria/entity/file.entity'
import {ObjectStorageClient} from 'oci-objectstorage'
import {S3} from 'aws-sdk'

export abstract class AbstractStorage {
    protected abstract logger: Logger
    protected abstract client: ObjectStorageClient | S3

    abstract getCredentials(): Record<string, string>

    abstract putObject(file: Express.Multer.File, objectName: string): Record<string, any>

    abstract getObject(file: File): Record<string, any>

    abstract deleteObject(...args: any): Record<string, any>
}
