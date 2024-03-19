import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '../../src/app.module'

const freeEan = '7256975112924'
const assignedEan = '5059977006091'
const assignedEanProductSku = 'UK008068'

describe('GET /barcode', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('responses with 404 if product with ean does not exist', () => {
    return request(app.getHttpServer()).get(`/v3/barcode/${freeEan}`).expect(404)
  })

  it('responses with 200 and SKU of product with that ean', () => {
    return request(app.getHttpServer())
      .get(`/v3/barcode/${assignedEan}`)
      .expect(200)
      .then((response) => {
        expect(response.body.sku).toEqual(assignedEanProductSku)
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
