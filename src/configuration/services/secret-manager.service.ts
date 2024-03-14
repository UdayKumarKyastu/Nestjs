import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { EnvironmentVariables } from '../models/environment-variables'
import { Secrets } from '../models/secrets'

@Injectable()
export class SecretManagerService {
  private gcpProjectName: string
  private client: SecretManagerServiceClient
  constructor(configService: ConfigService<EnvironmentVariables>) {
    this.gcpProjectName = `projects/${configService.get<string>('GCP_PROJECT_NAME')}`
    this.client = new SecretManagerServiceClient({ projectId: this.gcpProjectName })
  }
  private resolveSecretName(secretName: keyof Secrets) {
    return `${this.gcpProjectName}/secrets/${secretName}/versions/latest`
  }
  async getSecretValue(secretName: keyof Secrets) {
    const accessResponse = await this.client.accessSecretVersion({
      name: this.resolveSecretName(secretName),
    })
    if (!accessResponse[0]) {
      throw new Error(`Could not access "${secretName}" secret`)
    }
    const secretValue = accessResponse[0].payload?.data?.toString()
    if (!secretValue) {
      throw new Error(`"${secretName}" secret has no value`)
    }

    return secretValue
  }
}
