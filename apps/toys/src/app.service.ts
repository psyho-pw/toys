import {Inject, Injectable} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {lastValueFrom} from 'rxjs'
import {CreateUserDto} from './dto/create-user.dto'
import {AUTH_SERVICE} from '@app/common'

@Injectable()
export class AppService {
    constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

    async createUser(request: CreateUserDto, authentication: string) {
        return lastValueFrom(this.authClient.emit('message', {request, Authentication: authentication}))
    }
}
