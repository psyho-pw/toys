import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {MailerService} from '@nestjs-modules/mailer'
import {ISendMailOptions} from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface'

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {}

    public async sendSingle(options: ISendMailOptions) {
        return this.mailerService
            .sendMail(options)
            .then(() => this.logger.verbose('success'))
            .catch(err => this.logger.error(err))
    }
}
