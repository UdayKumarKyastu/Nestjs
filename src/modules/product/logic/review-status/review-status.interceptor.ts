import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

import { ReviewStatusService } from './review-status.service'

@Injectable()
export class ReviewStatusInterceptor implements NestInterceptor {
  constructor(private readonly _reviewStatusService: ReviewStatusService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { masterSku, variantSku, versionKey } = context.getArgs()[0].params

    if (versionKey) {
      await this._reviewStatusService.setOriginalVersion(versionKey)
    }

    await this._reviewStatusService.setOriginalProduct(masterSku)

    return next.handle().pipe(
      tap(async () => {
        const statusCode = context.switchToHttp().getResponse().statusCode
        if ([200, 204].includes(statusCode)) {
          await this._reviewStatusService.generateFieldReviewStatuses(
            masterSku,
            variantSku,
            versionKey,
          )
        }
      }),
      catchError((error) => {
        throw error
      }),
    )
  }
}
