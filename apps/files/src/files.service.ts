import {Injectable} from '@nestjs/common'
import {ConfigFileReader} from 'oci-common'
import {ConfigFileAuthenticationDetailsProvider} from 'oci-sdk'
import path from 'path'

@Injectable()
export class FilesService {
    private readonly configFilePath: string = path.resolve('apps/files/.oci/config')
    private readonly configProfile: string = 'DEFAULT'
    async getCredentials() {
        const config = ConfigFileReader.parseFileFromPath(this.configFilePath, this.configProfile)
        const profile = config.accumulator.configurationsByProfile.get(this.configProfile)

        const provider: ConfigFileAuthenticationDetailsProvider = new ConfigFileAuthenticationDetailsProvider(this.configFilePath, this.configProfile)
        console.log('user: ', provider.getUser())
        console.log('provider: ', provider)

        return Object.fromEntries(profile)
    }
}
