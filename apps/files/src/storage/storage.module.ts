import {Module} from '@nestjs/common'
import {OracleStorageService} from './oracle-storage.service'
import {StorageService} from './abstract-storage'

@Module({
    imports: [],
    providers: [{provide: StorageService, useClass: OracleStorageService}],
    exports: [StorageService],
})
export class StorageModule {}
