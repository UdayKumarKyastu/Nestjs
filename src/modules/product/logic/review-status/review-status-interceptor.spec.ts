import { of } from 'rxjs'

import { ReviewStatusInterceptor } from './review-status.interceptor'
import { ReviewStatusService } from './review-status.service'

const mockedReviewStatusService: Partial<ReviewStatusService> = {
  generateFieldReviewStatuses: jest.fn(),
  setOriginalProduct: jest.fn(),
}

const executionContext = {
  switchToHttp: jest.fn(() => ({
    getRequest: () => ({
      originalUrl: '/',
      method: 'PUT',
    }),
    getResponse: () => ({
      statusCode: 200,
    }),
    getNext: () => ({}),
  })),
  getArgs: jest.fn().mockReturnValue([{ params: {} }]),
}

const callHandler = {
  handle: jest.fn(() => of({})),
}

describe('ReviewStatusInterceptor', () => {
  let interceptor: ReviewStatusInterceptor

  beforeEach(() => {
    interceptor = new ReviewStatusInterceptor(mockedReviewStatusService as ReviewStatusService)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(interceptor).toBeDefined()
  })

  it('should set original product before request occurs', async () => {
    await interceptor.intercept(executionContext as any, callHandler)

    expect(mockedReviewStatusService.setOriginalProduct).toHaveBeenCalled()
  })

  it('should generate review status object when first next method is called', async () => {
    const reviewStatusInterceptor = await interceptor.intercept(
      executionContext as any,
      callHandler,
    )

    expect(mockedReviewStatusService.setOriginalProduct).toHaveBeenCalled()

    reviewStatusInterceptor.subscribe({
      next: () => {
        expect(mockedReviewStatusService.generateFieldReviewStatuses).toHaveBeenCalled()
      },
    })
  })

  it('should not generate review status object for failed request', async () => {
    const failedExecutionContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: () => ({
          originalUrl: '/',
          method: 'PUT',
        }),
        getResponse: () => ({
          statusCode: 500,
        }),
      })),
      getArgs: jest.fn().mockReturnValue([{ params: {} }]),
    }

    const reviewStatusInterceptor = await interceptor.intercept(
      failedExecutionContext as any,
      callHandler,
    )

    reviewStatusInterceptor.subscribe({
      next: () => {
        expect(mockedReviewStatusService.generateFieldReviewStatuses).not.toHaveBeenCalled()
      },
    })
  })
})
