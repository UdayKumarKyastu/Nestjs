import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import validator from 'validator'

import { AppModule } from '../../src/app.module'
import { searchResponseSchema } from '../schemas/search-response-schema'

describe('GET /products', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('responses with 200, matches schema and has more than one results for "coffe" by product name', () => {
    return request(app.getHttpServer())
      .get(`/v5/products?query=coffee&propertyName=name&limit=10&page=1`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(searchResponseSchema)
        expect(response.body.total).toBeGreaterThan(1)
      })
  })

  it('responses with 200, matches schema and has only one results for "UK008138" by SKU', () => {
    return request(app.getHttpServer())
      .get(`/v5/products?query=UK008138&propertyName=sku&limit=10&page=1`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(searchResponseSchema)
        expect(response.body.total).toEqual(1)
      })
  })

  it('responses with 200, matches schema and has only one results for "FP00001420" by Hamilton Grant ID', () => {
    return request(app.getHttpServer())
      .get(`/v5/products?query=FP00001420&propertyName=hgCode&limit=10&page=1`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(searchResponseSchema)
        expect(response.body.total).toEqual(1)
      })
  })

  it('responses with 200, matches schema and has zero results for "coffee" by SKU', () => {
    return request(app.getHttpServer())
      .get(`/v5/products?query=coffee&propertyName=sku&limit=10&page=1`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(searchResponseSchema)
        expect(response.body.total).toEqual(0)
      })
  })

  it('responses with 200, matches schema and has zero results for "coffee" by Hamilton Grant ID', () => {
    return request(app.getHttpServer())
      .get(`/v5/products?query=coffee&propertyName=hgCode&limit=10&page=1`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(searchResponseSchema)
        expect(response.body.total).toEqual(0)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
