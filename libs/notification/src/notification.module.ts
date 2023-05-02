import {Module} from '@nestjs/common'
import {DiscordService} from '@app/notification/discord.service'
import {HttpModule} from '@nestjs/axios'

@Module({
    imports: [HttpModule],
    providers: [DiscordService],
    exports: [DiscordService],
})
export class NotificationModule {}
