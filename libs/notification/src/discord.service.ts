import {Injectable, InternalServerErrorException, Logger} from '@nestjs/common'
import {HttpService} from '@nestjs/axios'
import {EmbedBuilder, WebhookClient} from 'discord.js'
import {APIEmbedField} from 'discord-api-types/v10'
import {ConfigService} from '@nestjs/config'
import {GeneralException} from '@app/common'

@Injectable()
export class DiscordService {
    private webhookClient: WebhookClient
    private webhookId: string
    private webhookToken: string
    private readonly logger = new Logger(DiscordService.name)

    private async getCredentials() {
        const webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL')

        if (!this.webhookId || !this.webhookToken) {
            const credentials = await this.httpService.axiosRef.get(webhookUrl)
            if (!credentials.data.id || !credentials.data.token) {
                throw new InternalServerErrorException('webhook credential fetch error')
            }

            this.webhookId = credentials.data.id
            this.webhookToken = credentials.data.token
        }
    }

    constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
        this.getCredentials()
            .then(() => this.logger.verbose('✅  DiscordNotificationModule instance initialized'))
            .catch(error => this.logger.error('error caught', error))
    }

    public async sendMessage(message: string, title?: string, additional?: Array<APIEmbedField>): Promise<void> {
        await this.getCredentials()
        if (!this.webhookClient) this.webhookClient = new WebhookClient({id: this.webhookId, token: this.webhookToken})

        const embed = new EmbedBuilder()
            .setTitle(title ? title : 'Error Report')
            .setColor('#ff0000')
            .addFields([{name: 'Message', value: message}])

        if (additional) embed.addFields([...additional])

        await this.webhookClient.send({embeds: [embed]})
    }

    public async sendErrorReport(err: any) {
        if (err instanceof GeneralException) {
            if (err.getStatus() > 400) await this.sendMessage(err.message, err.getCalledFrom(), [{name: 'stack', value: (err.stack || '').substring(0, 1024)}])
            return
        }
        await this.sendMessage(err.message, 'Unhandled Error', [{name: 'stack', value: (err.stack || '').substring(0, 1024)}])
    }
}
