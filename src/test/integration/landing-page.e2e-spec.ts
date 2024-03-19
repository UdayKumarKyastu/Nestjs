import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import validator from 'validator'

import { AppModule } from '../../src/app.module'
import { landingSchema } from '../schemas/landign-page-schema'

describe('Landing page endpoints', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  describe('GET /pending', () => {
    it('responses with 200 and matches schema for UK filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/pending?country=UK`)
        .expect(200)
        .then((response) => {
          console.log(response.body)
          expect(response.body).toMatchSchema(landingSchema)

          response.body.productGroups.forEach((productGroup: { changesCount: number }) => {
            expect(productGroup.changesCount).toBeGreaterThan(0)
          })
        })
    })

    it('responses with 200 and matches schema for US filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/pending?country=US`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          response.body.productGroups.forEach((productGroup: { changesCount: number }) => {
            expect(productGroup.changesCount).toBeGreaterThan(0)
          })
        })
    })

    it('responses with 200 and matches schema for FR filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/pending?country=FR`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          response.body.productGroups.forEach((productGroup: { changesCount: number }) => {
            expect(productGroup.changesCount).toBeGreaterThan(0)
          })
        })
    })

    it('responses with 200 and matches schema for HK filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/pending?country=HK`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          response.body.productGroups.forEach((productGroup: { changesCount: number }) => {
            expect(productGroup.changesCount).toBeGreaterThan(0)
          })
        })
    })
  })

  describe('GET /new', () => {
    it('responses with 200 and matches schema for UK filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/new?country=UK`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].createdAt)).toBe(
              true,
            )
          }
        })
    })

    it('responses with 200 and matches schema for US filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/new?country=US`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].createdAt)).toBe(
              true,
            )
          }
        })
    })

    it('responses with 200 and matches schema for FR filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/new?country=FR`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].createdAt)).toBe(
              true,
            )
          }
        })
    })

    it('responses with 200 and matches schema for HK filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/new?country=HK`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].createdAt)).toBe(
              true,
            )
          }
        })
    })
  })

  describe('GET /live-soon', () => {
    it('responses with 200 and matches schema for UK filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/live-soon?country=UK`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].liveFrom)).toBe(
              true,
            )
          }
        })
    })

    it('responses with 200 and matches schema for US filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/live-soon?country=US`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].liveFrom)).toBe(
              true,
            )
          }
        })
    })

    it('responses with 200 and matches schema for FR filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/live-soon?country=FR`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].liveFrom)).toBe(
              true,
            )
          }
        })
    })

    it('responses with 200 and matches schema for HK filter', () => {
      return request(app.getHttpServer())
        .get(`/v1/browse/live-soon?country=HK`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchSchema(landingSchema)

          if (response.body.productGroups.length > 0) {
            expect(validator.isISO8601(response.body.productGroups[0].variants[0].liveFrom)).toBe(
              true,
            )
          }
        })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
