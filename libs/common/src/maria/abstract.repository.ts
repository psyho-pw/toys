import {AbstractEntity} from '@app/common/maria/abstract.entity'
import {Logger} from '@nestjs/common'
import {DeleteResult, Repository} from 'typeorm'
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere'

export interface BaseRepository<T> {
    create(data: T | any): Promise<T>
    findOneById(id: number): Promise<T>
    findByCondition(filterCondition: any): Promise<T>
    findAll(): Promise<T[]>
    remove(id: number): Promise<DeleteResult>
    findWithRelations(relations: any): Promise<T[]>
}

export abstract class AbstractMariaRepository<T extends AbstractEntity> implements BaseRepository<T> {
    protected abstract readonly logger: Logger
    private readonly entity: Repository<T>

    constructor(entity: Repository<T>) {
        this.entity = entity
    }

    public async create(data: T): Promise<T> {
        return this.entity.save(data)
    }

    public async findOneById(id: number): Promise<T> {
        return this.entity.findOneBy({id} as FindOptionsWhere<T>)
    }

    public async findByCondition(filterCondition: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T> {
        return this.entity.findOne({where: filterCondition})
    }

    public async findWithRelations(relations: any): Promise<T[]> {
        return this.entity.find(relations)
    }

    public async findAll(): Promise<T[]> {
        return this.entity.find()
    }

    public async remove(id: number): Promise<DeleteResult> {
        return this.entity.delete(id)
    }
}
