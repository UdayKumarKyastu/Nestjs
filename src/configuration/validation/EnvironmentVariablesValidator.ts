import { validateSync } from 'class-validator'
import { plainToClass } from 'class-transformer'

import { EnvironmentVariables } from '../models/environment-variables'

export class EnvironmentVariablesValidator {
  static validate(config: Record<string, any>): EnvironmentVariables {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    })
    const errors = validateSync(validatedConfig, { skipMissingProperties: false })
    if (errors.length > 0) {
      throw new Error(errors.toString())
    }

    return validatedConfig
  }
}
