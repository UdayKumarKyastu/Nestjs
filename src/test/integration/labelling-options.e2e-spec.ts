import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '../../src/app.module'
import { labellingOptionsSchema } from '../schemas/labelling-options-schema'

describe('GET /product-types/food/labelling-options', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('responses with 200 and matches schema', () => {
    return request(app.getHttpServer())
      .get(`/v3/product-types/food/labelling-options`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(labellingOptionsSchema)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
