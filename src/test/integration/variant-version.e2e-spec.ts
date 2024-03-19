import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '../../src/app.module'
import { variantVersionSchema } from '../schemas/variant-version-schema'

describe('GET /products/{sku}/variants/{sku}/versions/{product_code}-{version}', () => {
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
      .get(`/v3/products/UK010059/variants/UK010059/versions/FP00000263-10`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(variantVersionSchema)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
