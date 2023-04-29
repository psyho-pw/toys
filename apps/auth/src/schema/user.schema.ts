import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {AbstractMongoResponse, AbstractMongoSchema, GeneralSchema} from '@app/common'
import {Exclude, Type} from 'class-transformer'

@GeneralSchema()
export class User extends AbstractMongoSchema {
    @Prop({required: false, type: String, default: null})
    email: string | null

    @Prop({required: false, type: String, default: null})
    password: string | null

    @Prop({required: true, type: String})
    name: string

    @Prop({required: false, type: String, default: null})
    refreshToken: string | null

    @Prop({required: false, type: String, default: null})
    pushToken: string | null

    @Prop({required: false, type: Number, default: null})
    activatedAt: number | null
}

export class UserResponse extends AbstractMongoResponse {}

export class UserExcludeCredentials extends UserResponse {
    @Exclude()
    declare password: string | null

    @Exclude()
    declare refreshToken: string | null
}

export const UserSchema = SchemaFactory.createForClass(User)
