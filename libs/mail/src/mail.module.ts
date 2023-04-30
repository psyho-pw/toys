import {DynamicModule, Module} from '@nestjs/common'
import {MailerModule} from '@nestjs-modules/mailer'
import {ConfigService} from '@nestjs/config'
import {PugAdapter} from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import * as path from 'path'
import {MailService} from '@app/mail/mail.service'

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
                defaults: {
                    from: '"no-reply" <email address>',
                },
                preview: true,
                template: {
                    dir: path.resolve(__dirname + '/../templates'),
                    adapter: new PugAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
    // static register(templatePath: string): DynamicModule {
    //     return {
    //         module: MailModule,
    //         imports: [
    //             MailerModule.forRootAsync({
    //                 useFactory: (configService: ConfigService) => ({
    //                     transport: {
    //                         host: configService.get<string>('MAIL_HOST'),
    //                         port: configService.get<string>('MAIL_PORT'),
    //                         auth: {
    //                             user: configService.get<string>('MAIL_USER'),
    //                             pass: configService.get<string>('MAIL_PASS'),
    //                         },
    //                     },
    //                     defaults: {
    //                         from: '"no-reply" <email address>',
    //                     },
    //                     preview: true,
    //                     template: {
    //                         dir: path.resolve(__dirname + templatePath),
    //                         adapter: new PugAdapter(),
    //                         options: {
    //                             strict: true,
    //                         },
    //                     },
    //                 }),
    //                 inject: [ConfigService],
    //             }),
    //         ],
    //         exports: [MailModule],
    //     }
    // }
}
