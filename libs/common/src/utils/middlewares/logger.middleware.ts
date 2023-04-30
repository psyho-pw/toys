import {Request, Response, NextFunction} from 'express'
import {Injectable, NestMiddleware, Inject, Logger} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger: Logger
    constructor(@Inject(ConfigService) configService: ConfigService) {
        this.logger = new Logger(`HTTP:${configService.get<number>('PORT')}`)
    }

    public use(request: Request, response: Response, next: NextFunction): void {
        const {ip, method, originalUrl} = request
        const userAgent = request.get('user-agent') || ''
        //request log
        this.logger.log(`REQUEST [${method} ${originalUrl}] ${ip} ${userAgent}`, {
            // header: request.headers,
            query: request.query,
            body: request.body,
        })

        const send = response.send
        response.send = exitData => {
            const {statusCode} = response
            try {
                exitData = JSON.parse(exitData)
            } catch (err) {}
            //response log
            this.logger.log(`RESPONSE`, {status: statusCode, data: exitData})

            response.send = send
            return response.send(exitData)
        }
        next()
    }
}
