import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import validator from 'validator'

import { AppModule } from '../../src/app.module'
import { productResponseSchema } from '../schemas/product-response-schema'
import { LiveStatus } from '../../src/shared/model/live-status'

const ukFoodSku = 'UK008138'
const ukBaristaSku = 'UK005978'
const usProductSku = 'US002830'
const frProductSku = 'FR003885'
const hkProductSku = 'HK001881'

describe('GET /product', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  it('responses with 200 for UK food product', () => {
    return request(app.getHttpServer())
      .get(`/v3/products/${ukFoodSku}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(productResponseSchema)

        const product = response.body.product
        expect(product.type).toEqual('food')
        expect(product.setUp).toBeNull()
        expect(product.country).toEqual('United Kingdom')
        expect(product.countryCode).toEqual('UK')
        expect(validator.isISO8601(product.createdAt)).toBe(true)
        expect(product.taxCategory).toBeDefined()

        const variant = response.body.product.variants[0]
        expect(variant.attributes).toBeNull()
        expect(variant.labelling).toBeDefined()
        if (variant.availability.displayAsNew.isDisplayed) {
          expect(validator.isISO8601(variant.availability.displayAsNew.until)).toBe(true)
        } else {
          expect(variant.availability.displayAsNew.until).toBeNull()
        }
        if (variant.availability.liveSchedule.off) {
          expect(validator.isISO8601(variant.availability.liveSchedule.off)).toBe(true)
        }
        if (variant.availability.liveSchedule.on) {
          expect(validator.isISO8601(variant.availability.liveSchedule.on)).toBe(true)
        }
      })
  })

  it('responses with 200 for UK barista product', () => {
    const expectedMasterName = 'Iced Americano'
    const expectedVariantName = 'Iced Americano with Semi-skimmed Milk'

    return request(app.getHttpServer())
      .get(`/v3/products/${ukBaristaSku}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(productResponseSchema)

        const product = response.body.product
        expect(product.type).toEqual('barista_beverage')
        expect(product.setUp).toBeDefined()
        expect(product.country).toEqual('United Kingdom')
        expect(product.countryCode).toEqual('UK')
        expect(validator.isISO8601(product.createdAt)).toBe(true)
        expect(product.taxCategory).toBeDefined()

        expect(product.variants[0].name['en-GB']).toEqual(expectedMasterName)
        expect(product.variants[2].name['en-GB']).toEqual(expectedVariantName)

        expect(product.variants[0].availability.isLive).toBe(true)
        expect(product.variants[0].status).toEqual(LiveStatus.ACTIVE)
        expect(product.variants[15].availability.isLive).toBe(false)
        expect(product.variants[15].status).toEqual(LiveStatus.INACTIVE)
        expect(product.variants[16].availability.isLive).toBe(true)
        expect(product.variants[16].status).toEqual(LiveStatus.ACTIVE)

        const variant = response.body.product.variants[0]
        expect(variant.attributes).toBeDefined()
        expect(variant.labelling).toBeNull()
        if (variant.availability.displayAsNew.isDisplayed) {
          expect(validator.isISO8601(variant.availability.displayAsNew.until)).toBe(true)
        } else {
          expect(variant.availability.displayAsNew.until).toBeNull()
        }
        if (variant.availability.liveSchedule.off) {
          expect(validator.isISO8601(variant.availability.liveSchedule.off)).toBe(true)
        }
        if (variant.availability.liveSchedule.on) {
          expect(validator.isISO8601(variant.availability.liveSchedule.on)).toBe(true)
        }
      })
  })

  it('responses with 200 for US product', () => {
    return request(app.getHttpServer())
      .get(`/v3/products/${usProductSku}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(productResponseSchema)

        const product = response.body.product
        expect(product.type).toEqual('food')
        expect(product.setUp).toBeNull()
        expect(product.country).toEqual('United States')
        expect(product.countryCode).toEqual('US')
        expect(validator.isISO8601(product.createdAt)).toBe(true)
        expect(product.taxCategory).toBeNull()

        const variant = response.body.product.variants[0]
        expect(variant.attributes).toBeNull()
        expect(variant.labelling).toBeDefined()
        if (variant.availability.displayAsNew.isDisplayed) {
          expect(validator.isISO8601(variant.availability.displayAsNew.until)).toBe(true)
        } else {
          expect(variant.availability.displayAsNew.until).toBeNull()
        }
        if (variant.availability.liveSchedule.off) {
          expect(validator.isISO8601(variant.availability.liveSchedule.off)).toBe(true)
        }
        if (variant.availability.liveSchedule.on) {
          expect(validator.isISO8601(variant.availability.liveSchedule.on)).toBe(true)
        }
      })
  })

  it('responses with 200 for FR product', () => {
    return request(app.getHttpServer())
      .get(`/v3/products/${frProductSku}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(productResponseSchema)

        const product = response.body.product
        expect(product.type).toEqual('food')
        expect(product.setUp).toBeNull()
        expect(product.country).toEqual('France')
        expect(product.countryCode).toEqual('FR')
        expect(validator.isISO8601(product.createdAt)).toBe(true)
        expect(product.taxCategory).toBeNull()

        const variant = response.body.product.variants[0]
        expect(variant.attributes).toBeNull()
        expect(variant.labelling).toBeDefined()
        if (variant.availability.displayAsNew.isDisplayed) {
          expect(validator.isISO8601(variant.availability.displayAsNew.until)).toBe(true)
        } else {
          expect(variant.availability.displayAsNew.until).toBeNull()
        }
        if (variant.availability.liveSchedule.off) {
          expect(validator.isISO8601(variant.availability.liveSchedule.off)).toBe(true)
        }
        if (variant.availability.liveSchedule.on) {
          expect(validator.isISO8601(variant.availability.liveSchedule.on)).toBe(true)
        }
      })
  })

  it('responses with 200 for HK product', () => {
    return request(app.getHttpServer())
      .get(`/v3/products/${hkProductSku}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchSchema(productResponseSchema)

        const product = response.body.product
        expect(product.type).toEqual('food')
        expect(product.setUp).toBeNull()
        expect(product.country).toEqual('Hong Kong')
        expect(product.countryCode).toEqual('HK')
        expect(validator.isISO8601(product.createdAt)).toBe(true)
        expect(product.taxCategory).toBeNull()

        const variant = response.body.product.variants[0]
        expect(variant.attributes).toBeNull()
        expect(variant.labelling).toBeDefined()
        if (variant.availability.displayAsNew.isDisplayed) {
          expect(validator.isISO8601(variant.availability.displayAsNew.until)).toBe(true)
        } else {
          expect(variant.availability.displayAsNew.until).toBeNull()
        }
        if (variant.availability.liveSchedule.off) {
          expect(validator.isISO8601(variant.availability.liveSchedule.off)).toBe(true)
        }
        if (variant.availability.liveSchedule.on) {
          expect(validator.isISO8601(variant.availability.liveSchedule.on)).toBe(true)
        }
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
