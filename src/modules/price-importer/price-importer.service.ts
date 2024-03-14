import { HttpService } from '@nestjs/axios'
import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import FormData from 'form-data'
import { lastValueFrom } from 'rxjs'
import { GoogleAuth } from 'google-auth-library'

import { EnvironmentVariables } from '../../configuration/models/environment-variables'

@Injectable()
export class PriceImporterService {
  constructor(
    private _httpService: HttpService,
    private _configService: ConfigService<EnvironmentVariables>,
  ) {}

  private async getClientConfig(): Promise<{
    baseUrl: string
    baseHeaders: { [key: string]: string }
  }> {
    const priceImporterUrl = this._configService.get('PRICE_IMPORTER_API_URL')!
    const auth = new GoogleAuth()

    const config = {
      baseUrl: priceImporterUrl,
      baseHeaders: {
        // used in local dev
        ...(process.env.GCLOUD_AUTH_TOKEN && {
          Authorization: `Bearer ${process.env.GCLOUD_AUTH_TOKEN}`,
        }),
      },
    }

    if (!process.env.GCLOUD_AUTH_TOKEN) {
      try {
        const client = await auth.getIdTokenClient(priceImporterUrl)
        const clientHeaders = await client.getRequestHeaders()

        config.baseHeaders = { ...config.baseHeaders, ...clientHeaders }
      } catch (e: any) {
        console.warn('Could not attach GCP client headers', e.message)
      }
    }

    return config
  }

  async upload(formData: FormData): Promise<any> {
    const { baseUrl, baseHeaders } = await this.getClientConfig()

    try {
      const res = await lastValueFrom(
        this._httpService.post(`${baseUrl}/upload`, formData, {
          headers: {
            ...formData.getHeaders(),
            ...baseHeaders,
          },
        }),
      )

      return res.data
    } catch (err: any) {
      if (err.response) {
        console.error('Error uploading price import CSV', JSON.stringify(err.response.data))
        throw new HttpException(err.response.data, err.response.status)
      }

      throw err
    }
  }

  async getStatus(uuid: string): Promise<any> {
    const { baseUrl, baseHeaders } = await this.getClientConfig()

    try {
      const res = await lastValueFrom(
        this._httpService.get(`${baseUrl}/${uuid}/status`, {
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

  async trigger(uuid: string): Promise<any> {
    const { baseUrl, baseHeaders } = await this.getClientConfig()

    try {
      const res = await lastValueFrom(
        this._httpService.post(`${baseUrl}/${uuid}/trigger`, null, {
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
}
