import {Prop, Schema, SchemaOptions} from '@nestjs/mongoose'
import {SchemaTypes, Types} from 'mongoose'
import {ToDateTransform} from '@app/common/utils/decorators/transform.decorator'

export function GeneralSchema(options?: SchemaOptions) {
    return Schema({
        versionKey: false,
        timestamps: {currentTime: () => Date.now()},
        ...options,
    })
}
export class AbstractMongoSchema {
    @Prop({type: SchemaTypes.ObjectId})
    _id: Types.ObjectId

    @Prop()
    createdAt: number

    @Prop()
    updatedAt: number

    @Prop({required: false, default: null, type: Number})
    deletedAt: number | null
}

export class AbstractMongoResponse {
    @ToDateTransform()
    createdAt: Date

    @ToDateTransform()
    updatedAt: Date

    @ToDateTransform()
    deletedAt: Date | null
}
