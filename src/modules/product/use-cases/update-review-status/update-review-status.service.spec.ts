import { Test, TestingModule } from '@nestjs/testing'

import { ReviewStatusService } from '../../logic/review-status/review-status.service'

import { UpdateReviewStatusService } from './update-review-status.service'

describe('UpdateReviewStatusService', () => {
  let service: UpdateReviewStatusService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateReviewStatusService],
    })
      .useMocker((token) => {
        if (token === ReviewStatusService) {
          return {}
        }
      })
      .compile()

    service = module.get<UpdateReviewStatusService>(UpdateReviewStatusService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
