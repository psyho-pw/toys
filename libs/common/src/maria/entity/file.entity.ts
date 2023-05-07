import {Column, Entity, Index} from 'typeorm'
import {AbstractActorEntity} from '@app/common/maria/abstract.entity'

@Entity()
export class File extends AbstractActorEntity {
    @Index({unique: true})
    @Column({type: 'varchar', length: 24, nullable: false})
    objectName: string

    @Column()
    originalName: string

    @Column()
    mimeType: string

    @Column()
    size: number

    @Index()
    @Column()
    opcRequestId: string

    @Column()
    opcContentMd5: string

    @Column()
    eTag: string

    @Column()
    versionId: string
}
