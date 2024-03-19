import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '../../src/app.module'
import { reportingSchema } from '../schemas/reporting-schema'

describe('GET /product-types/{type}/reporting', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('responses with 200 and matches schema for barista type', () => {
    return request(app.getHttpServer())
      .get(`/v3/product-types/barista_beverage/reporting`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(reportingSchema)
      })
  })

  it('responses with 200 and matches schema for food type', () => {
    return request(app.getHttpServer())
      .get(`/v3/product-types/food/reporting`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(reportingSchema)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
