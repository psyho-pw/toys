import {Column, Entity, Index} from 'typeorm'
import {AbstractEntity} from '@app/common/maria/abstract.entity'

@Entity()
export class User extends AbstractEntity {
    @Index()
    @Column({nullable: true})
    email: string | null

    @Column({nullable: true})
    password: string | null

    @Column()
    name: string

    @Column({nullable: true})
    refreshToken: string | null

    @Column({nullable: true})
    pushToken: string | null

    @Column({nullable: true})
    activatedAt: Date | null
}
