import {Module} from '@nestjs/common'
import {OracleStorageService} from './oracle-storage.service'

@Module({
    imports: [],
    providers: [OracleStorageService],
    exports: [OracleStorageService],
})
export class StorageModule {}
