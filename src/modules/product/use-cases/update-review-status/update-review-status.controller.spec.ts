import { Test, TestingModule } from '@nestjs/testing'

import { ReviewStatusService } from '../../logic/review-status/review-status.service'
import { AuthService } from '../../../../modules/auth/auth.service'

import { UpdateReviewStatusController } from './update-review-status.controller'
import { UpdateReviewStatusService } from './update-review-status.service'

describe('ReviewStatusController', () => {
  let controller: UpdateReviewStatusController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateReviewStatusController],
    })
      .useMocker((token) => {
        if (token === ReviewStatusService) {
          return {}
        }

        if (token === UpdateReviewStatusService) {
          return {}
        }

        if (token === AuthService) {
          return {}
        }
      })
      .compile()

    controller = module.get<UpdateReviewStatusController>(UpdateReviewStatusController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
