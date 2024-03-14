import { HttpService } from '@nestjs/axios'
import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { lastValueFrom } from 'rxjs'
import { GoogleAuth } from 'google-auth-library'

import { EnvironmentVariables } from '../../../configuration/models/environment-variables'

import { Reward } from './models/reward'
import { RewardCategory } from './models/reward-category'

@Injectable()
export class LoyaltyService {
  constructor(
    private _httpService: HttpService,
    private _configService: ConfigService<EnvironmentVariables>,
  ) {}

  private async getClientConfig(): Promise<{
    baseUrl: string
    baseHeaders: { [key: string]: string }
  }> {
    const loayaltyApiUrl = this._configService.get('PORTAL_API_EAGLE_EYE_API_URL')!
    const auth = new GoogleAuth()

    const config = {
      baseUrl: loayaltyApiUrl,
      baseHeaders: {
        // used in local dev
        ...(process.env.GCLOUD_AUTH_TOKEN && {
          Authorization: `Bearer ${process.env.GCLOUD_AUTH_TOKEN}`,
        }),
      },
    }

    if (!process.env.GCLOUD_AUTH_TOKEN) {
      try {
        const client = await auth.getIdTokenClient(loayaltyApiUrl)

        const clientHeaders = await client.getRequestHeaders()

        config.baseHeaders = { ...config.baseHeaders, ...clientHeaders }
      } catch (e: any) {
        console.warn('Could not attach GCP client headers', e.message)
      }
    }

    return config
  }

  async getRewardsSummary(walletId: string) {
    const { baseUrl, baseHeaders } = await this.getClientConfig()

    try {
      const res = await lastValueFrom(
        this._httpService.get(`${baseUrl}/v1/wallet/${walletId}/reward/summary`, {
          headers: baseHeaders,
        }),
      )

      return res.data
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status)
      }

      throw err
    }
  }

  async getRewards(walletId: string): Promise<Reward[]> {
    const { baseUrl, baseHeaders } = await this.getClientConfig()

    try {
      const res = await lastValueFrom(
        this._httpService.get(`${baseUrl}/v1/wallet/${walletId}/reward`, {
          headers: baseHeaders,
        }),
      )

      return res.data.rewards
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status)
      }

      throw err
    }
  }

  async getRewardCategories(): Promise<RewardCategory[]> {
    const { baseHeaders } = await this.getClientConfig()

    const pretApiUrl = this._configService.get('PORTAL_API_PRET_API_URL')!

    try {
      const res = await lastValueFrom(
        this._httpService.get(`${pretApiUrl}/v2/categories/reward-categories`, {
          headers: {
            ...baseHeaders,
            'pret-locale': 'en-GB',
          },
        }),
      )

      return res.data
    } catch (err: any) {
      if (err.response) {
        throw new HttpException(err.response.data, err.response.status)
      }

      throw err
    }
  }
}
