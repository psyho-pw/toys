import {AbstractMariaRepository} from '@app/common'
import {Injectable, Logger} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {File} from '@app/common/maria/entity/file.entity'

@Injectable()
export class FilesRepository extends AbstractMariaRepository<File> {
    protected readonly logger: Logger

    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {
        super(fileRepository)
    }
}
