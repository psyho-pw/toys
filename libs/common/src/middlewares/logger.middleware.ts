import {Request, Response, NextFunction} from 'express'
import {Injectable, NestMiddleware, Inject, Logger} from '@nestjs/common'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP')

    public use(request: Request, response: Response, next: NextFunction): void {
        const {ip, method, originalUrl} = request
        const userAgent = request.get('user-agent') || ''
        //request log
        this.logger.debug(`REQUEST [${method} ${originalUrl}] ${ip} ${userAgent}`, {
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
            this.logger.debug(`RESPONSE`, {status: statusCode, data: exitData})

            response.send = send
            return response.send(exitData)
        }
        next()
    }
}
