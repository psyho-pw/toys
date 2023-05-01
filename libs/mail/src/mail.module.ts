import {Module} from '@nestjs/common'
import {MailerModule} from '@nestjs-modules/mailer'
import {ConfigService} from '@nestjs/config'
import * as path from 'path'
import {MailService} from '@app/mail/mail.service'
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('MAIL_HOST'),
                    port: configService.get<string>('MAIL_PORT'),
                    auth: {
                        user: configService.get<string>('MAIL_USER'),
                        pass: configService.get<string>('MAIL_PASS'),
                    },
                },
                defaults: {from: '"no-reply" <noreply@noreply.com>'},
                preview: false,
                template: {
                    dir: path.resolve('templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {strict: true},
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
