import {Injectable} from '@nestjs/common'
import common from 'oci-common'

@Injectable()
export class FilesService {
    getHello(): string {
        // Using default configuration
        // const provider: common.ConfigFileAuthenticationDetailsProvider = new common.ConfigFileAuthenticationDetailsProvider()
        // Using personal configuration
        const configurationFilePath = '/usr/src/apps/files/.oci-config'
        const configProfile = 'your_profile_name'

        const config = common.ConfigFileReader.parseDefault(configurationFilePath)
        const profile = config.accumulator.configurationsByProfile.get(configProfile)
        console.log(profile)
        const customCompartmentId = profile.get('customCompartmentId') || ''

        const provider: common.ConfigFileAuthenticationDetailsProvider = new common.ConfigFileAuthenticationDetailsProvider(configurationFilePath, configProfile)

        console.log(provider.getUser())

        return 'Hello World!'
    }
}
