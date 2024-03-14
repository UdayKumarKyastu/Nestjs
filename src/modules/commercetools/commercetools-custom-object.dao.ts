import {
  ClientResponse,
  CustomObject,
  CustomObjectPagedQueryResponse,
} from '@commercetools/platform-sdk'
import { Injectable, NotFoundException } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'

import { CommercetoolsContext } from './commercetools-context'

export interface ICanFetchCustomObjects {
  getCustomObjectsByIds(ids: string[]): Promise<ClientResponse<CustomObjectPagedQueryResponse>>

  getCustomObjectByKey(key: string): Promise<CustomObject | null>
  getCustomObjectByKeyOrThrow(key: string, error?: HttpException): Promise<CustomObject>
}

export interface ICanWriteCustomObjects {
  writeCustomObject<D extends any>(
    objectKey: string,
    container: string,
    data: D,
  ): Promise<ClientResponse<CustomObject>>
}

@Injectable()
export class CommercetoolsCustomObjectDao
  implements ICanFetchCustomObjects, ICanWriteCustomObjects
{
  constructor(private _ct: CommercetoolsContext) {}

  getCustomObjectsByIds(ids: string[]) {
    return this._ct.customObjects
      .get({
        queryArgs: {
          where: `id in (${ids.map((id) => `"${id}"`).join(',')})`,
        },
      })
      .execute()
  }

  writeCustomObject<D extends any>(objectKey: string, container: string, data: D) {
    const req = this._ct.customObjects.post({ body: { value: data, key: objectKey, container } })

    return req.execute()
  }

  getCustomObjectByKey(key: string): Promise<CustomObject | null> {
    return this._ct.customObjects
      .get({
        queryArgs: {
          where: `key = "${key}"`,
        },
      })
      .execute()
      .then((resp) => resp.body.results[0] || null)
  }

  async getCustomObjectByKeyOrThrow(
    key: string,
    error = new NotFoundException(`Version with key: ${key} was not found`),
  ): Promise<CustomObject> {
    const result = await this.getCustomObjectByKey(key)

    if (!result) {
      throw error
    }

    return result
  }
}
