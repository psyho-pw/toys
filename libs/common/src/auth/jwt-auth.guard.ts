import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {catchError, Observable, tap} from 'rxjs'
import {AUTH_SERVICE} from '@app/common/services'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name)
    constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authentication = this.getAuthentication(context)
        this.logger.debug(authentication)
        return this.authClient
            .send('validate_user', {
                Authentication: authentication,
            })
            .pipe(
                tap(res => {
                    this.addUser(res, context)
                }),
                catchError(err => {
                    throw new UnauthorizedException()
                }),
            )
    }

    private getAuthentication(context: ExecutionContext) {
        let authentication: string
        if (context.getType() === 'rpc') {
            authentication = context.switchToRpc().getData().Authentication
        } else if (context.getType() === 'http') {
            this.logger.verbose(context.switchToHttp().getRequest().cookies)
            authentication = context.switchToHttp().getRequest().cookies?.Authentication
        }

        if (!authentication) {
            throw new UnauthorizedException('No value was provided for Authentication')
        }

        return authentication
    }

    private addUser(user: any, context: ExecutionContext) {
        if (context.getType() === 'rpc') {
            context.switchToRpc().getData().user = user
        } else if (context.getType() === 'http') {
            context.switchToHttp().getRequest().user = user
        }
    }
}
