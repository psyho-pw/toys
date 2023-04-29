import {Column, Entity, Index} from 'typeorm'
import {AbstractEntity} from '@app/common/maria/abstract.entity'
import {compare, genSalt, hash} from 'bcrypt'
import {Exclude} from 'class-transformer'

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

    public async validatePassword(password: string) {
        return compare(password, this.password)
    }

    public async setPassword(password: string) {
        const salt = await genSalt()
        console.log(salt, password)
        this.password = await hash(password, salt)
    }
}

export class UserExcludeCredentials extends User {
    @Exclude()
    declare password: string

    @Exclude()
    declare refreshToken: string
}
