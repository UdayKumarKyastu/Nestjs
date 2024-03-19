import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '../../src/app.module'
import { howToDisplaySchema } from '../schemas/how-to-display-schema'

describe('GET /product-types/{type}/how-to-display', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('responses with 200 and matches schema for food type', () => {
    return request(app.getHttpServer())
      .get(`/v3/product-types/food/how-to-display`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(howToDisplaySchema)
      })
  })

  it('responses with 200 and matches schema for barista type', () => {
    return request(app.getHttpServer())
      .get(`/v3/product-types/barista_beverage/how-to-display`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(howToDisplaySchema)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
