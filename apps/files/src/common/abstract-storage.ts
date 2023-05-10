import {File} from '@app/common/maria/entity/file.entity'

export abstract class AbstractStorage {
    abstract getCredentials(): Record<string, string>

    abstract putObject(file: Express.Multer.File, objectName: string): Record<string, any>

    abstract getObject(file: File): Record<string, any>

    abstract deleteObject(...args: any): Record<string, any>
}
