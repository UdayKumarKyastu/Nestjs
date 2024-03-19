import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '../../src/app.module'
import { taxCategoriesSchema } from '../schemas/tax-categories-schema'

describe('GET /product-types/{productType}/tax-categories', () => {
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
      .get(`/v3/product-types/{productType}/tax-categories`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(taxCategoriesSchema)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
