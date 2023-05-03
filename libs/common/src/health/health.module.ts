import {Module} from '@nestjs/common'
import {TerminusModule} from '@nestjs/terminus'
import {HttpModule} from '@nestjs/axios'
import {HealthController} from '@app/common/health/health.controller'
import {HomeController} from '@app/common/health/home.controller'

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [HealthController, HomeController],
})
export class HealthModule {}
