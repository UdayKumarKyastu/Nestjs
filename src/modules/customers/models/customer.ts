interface Identity {
  user_id: string
  provider: string
  connection: string
  isSocial: boolean
}

interface UserMetadata {
  emailOptIn: string
}

interface AppMetadata {
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

interface BillingAddress {
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

export interface Customer {
  created_at: string
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  identities: Identity[]
  name: string
  nickname: string
  picture: string
  updated_at: string
  user_id: string
  user_metadata: UserMetadata
  last_login: string
  last_ip: string
  logins_count: number
  app_metadata: AppMetadata
  billing_address: BillingAddress
  blocked?: boolean
}
