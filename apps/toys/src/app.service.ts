import {Inject, Injectable, InternalServerErrorException} from '@nestjs/common'
import {ClientProxy} from '@nestjs/microservices'
import {catchError, lastValueFrom, tap} from 'rxjs'
import {CreateUserDto} from './dto/create-user.dto'
import {AUTH_SERVICE, FILES_SERVICE} from '@app/common'

@Injectable()
export class AppService {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy,
        @Inject(FILES_SERVICE) private filesClient: ClientProxy,
    ) {}

    async createUser(request: CreateUserDto, authentication: string) {
        return lastValueFrom(
            this.authClient.emit('message', {request, Authentication: authentication}),
        )
    }

    async testFiles(id: number, authentication: string) {
        // const test = await lastValueFrom(
        //     this.filesClient.emit('get-file', {request: {id}, Authentication: authentication}),
        // )

        // console.log('----------------', test)

        return this.filesClient
            .send('get-file', {
                request: {id},
                Authentication: authentication,
            })
            .pipe(
                tap(res => res),
                catchError(err => {
                    throw new InternalServerErrorException(err)
                }),
            )

        // return test
    }
}
