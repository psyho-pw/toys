import {Module} from '@nestjs/common'
import {FilesController} from './files.controller'
import {FilesService} from './files.service'
import {FilesRepository} from './fiiles.repository'
import {StorageModule} from '../storage/storage.module'
import {TypeOrmModule} from '@nestjs/typeorm'
import {File} from '@app/common/maria/entity/file.entity'
import {AuthModule} from '@app/common'

@Module({
    imports: [TypeOrmModule.forFeature([File]), AuthModule, StorageModule],
    controllers: [FilesController],
    providers: [FilesService, FilesRepository],
})
export class FilesModule {}
