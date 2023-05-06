import {Column, Entity, Index} from 'typeorm'
import {AbstractActorEntity} from '@app/common/maria/abstract.entity'

@Entity()
export class File extends AbstractActorEntity {
    @Column()
    @Index()
    objectName: string

    @Column()
    originalName: string

    @Column()
    mimeType: string

    @Column()
    size: number

    @Column()
    @Index()
    opcRequestId: string

    @Column()
    opcContentMd5: string

    @Column()
    eTag: string

    @Column()
    versionId: string
}
