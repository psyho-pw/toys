import {Logger} from '@nestjs/common'
import {File} from '@app/common/maria/entity/file.entity'
import {ObjectStorageClient} from 'oci-objectstorage'
import {S3} from 'aws-sdk'

export abstract class StorageService {
    protected abstract logger: Logger
    protected abstract client: ObjectStorageClient | S3

    public abstract getCredentials(): Record<string, string>

    public abstract putObject(
        file: Express.Multer.File,
        objectName: string,
    ): Promise<Record<string, any>>

    public abstract getObject(file: File): Promise<Record<string, any>>

    public abstract deleteObject(...args: any): Promise<Record<string, any>>

    public abstract getUrl(file: File): Promise<string>
}
