import {Controller, Get} from '@nestjs/common'
import {ApiTags} from '@nestjs/swagger'
import {HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, MongooseHealthIndicator, TypeOrmHealthIndicator} from '@nestjs/terminus'
import {ConfigService} from '@nestjs/config'

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private memory: MemoryHealthIndicator,
        private db: MongooseHealthIndicator,
        private mariadb: TypeOrmHealthIndicator,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        console.log(`http://localhost:${this.configService.get<number>('PORT')}`)
        return this.health.check([
            () => this.http.pingCheck('Basic', `http://localhost:${this.configService.get<number>('PORT')}`),
            () => this.memory.checkHeap('memory heap', 150 * 1024 * 1024),
            () => this.mariadb.pingCheck('mariadb'),
            // () => this.db.pingCheck('mongoDB'),
        ])
    }
}
