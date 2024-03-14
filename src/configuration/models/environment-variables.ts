import { IsNumber, IsString } from 'class-validator'
import { Expose } from 'class-transformer'

export class EnvironmentVariables {
  @IsNumber()
  @Expose()
  PORT?: number = 3000

  @IsString()
  @Expose()
  API_HOST!: string

  @IsString()
  @Expose()
  GCP_PROJECT_NAME!: string

  @IsString()
  @Expose()
  COMMERCETOOLS_PROJECT_KEY!: string

  @IsString()
  @Expose()
  COMMERCETOOLS_API_URL!: string

  @IsString()
  @Expose()
  COMMERCETOOLS_AUTH_URL!: string

  @IsString()
  @Expose()
  CONTENTFUL_SPACE_ID!: string

  @IsString()
  @Expose()
  STARKIS_API_URL!: string

  @IsString()
  @Expose()
  PRICE_IMPORTER_API_URL!: string

  @IsString()
  @Expose()
  PORTAL_API_EAGLE_EYE_API_URL!: string

  @IsString()
  @Expose()
  PORTAL_API_PRET_API_URL!: string

  @IsString()
  @Expose()
  PORTAL_API_AUTH0_API_URL!: string

}
