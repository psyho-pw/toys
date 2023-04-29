import {AbstractMongoSchema} from '@app/common/mongo/abstract.schema'
import {Logger, NotFoundException} from '@nestjs/common'
import {Connection, FilterQuery, Model, SaveOptions, Types, UpdateQuery} from 'mongoose'

export abstract class AbstractMongoRepository<T extends AbstractMongoSchema> {
    protected abstract readonly logger: Logger

    constructor(protected readonly model: Model<T>, private readonly connection: Connection) {
        console.log(connection)
    }

    async create(document: Omit<T, '_id'>, options?: SaveOptions): Promise<T> {
        const doc = new this.model({...document, _id: new Types.ObjectId()})
        return doc.save(options).then(e => e.toJSON() as unknown as T)
    }

    async findOne(filterQuery: FilterQuery<T>): Promise<T> {
        const doc = await this.model.findOne(filterQuery, {}, {lean: true})
        if (!doc) throw new NotFoundException('document not found')
        return doc
    }

    async findOneAndUpdate(filterQuery: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
        const doc = await this.model.findOneAndUpdate(filterQuery, update, {lean: true, new: true})
        if (!doc) {
            this.logger.warn('document not found with filterQuery:', filterQuery)
            throw new NotFoundException('document not found')
        }
        return doc
    }

    async upsert(filterQuery: FilterQuery<T>, document: Partial<T>): Promise<T> {
        return this.model.findOneAndUpdate(filterQuery, document, {lean: true, upsert: true, new: true})
    }

    async find(filterQuery: FilterQuery<T>): Promise<T[]> {
        return this.model.find(filterQuery, {}, {lean: true})
    }

    async startTransaction() {
        const session = await this.connection.startSession()
        session.startTransaction()
        return session
    }
}
