import {CreateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn} from 'typeorm'
import {User} from '@app/common/maria/entity/user.entity'

export abstract class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date | null
}

export abstract class AbstractActorEntity extends AbstractEntity {
    @ManyToOne('User', 'id')
    @JoinColumn()
    createdBy: Relation<User>

    @ManyToOne('User', 'id')
    @JoinColumn()
    updatedBy: Relation<User>

    @ManyToOne('User', 'id')
    @JoinColumn()
    deletedBy: Relation<User>
}
