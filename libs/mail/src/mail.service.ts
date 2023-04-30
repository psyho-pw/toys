import {Injectable, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {MailerService} from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name)
    constructor(private readonly configService: ConfigService, private readonly mailerService: MailerService) {}

    public async sendSingle() {
        return this.mailerService.sendMail({
            to: 'fishcreek@naver.com',
            from: 'noreply@nestjs.com',
            subject: 'Testing Mailer module',
            text: 'welcome',
            // html: '<b>welcome</b>',
            template: 'activation_code.html',
            context: {
                username: 'Jason Smith',
                code: 'sdoin2123',
            },
        })
    }
}
