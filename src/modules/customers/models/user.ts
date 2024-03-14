export interface BillingAddress {
  first_name?: string
  last_name?: string
  email?: string
  company?: string
  phone?: string
  line1?: string
  line2?: string
  line3?: string
  city?: string
  state_code?: string
  state?: string
  country?: string
  zip?: string
  validation_status?: string
}

export interface Identity {
  user_id: string
  provider: string
  connection: string
  isSocial: boolean
}

export interface UserMetadata {
  emailOptIn: string
}

export interface AppMetadata {
  locale: string
  pret_id: string
  phone_number: string
  sms_verified: boolean
  adyen_id: string
  cbee_id: string
  ctools_id: string
  eeye_wallet_id: string
  pret_public_id: string
}

export interface User {
  created_at: Date
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  identities: Identity[]
  name: string
  nickname: string
  picture: string
  updated_at: Date
  user_id: string
  user_metadata: UserMetadata
  last_login: Date
  last_ip: string
  logins_count: number
  app_metadata: AppMetadata
  blocked: boolean
  locale: string
  billing_address: BillingAddress
}
