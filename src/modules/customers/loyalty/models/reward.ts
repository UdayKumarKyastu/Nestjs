export interface Reward {
  accountId: number
  campaignId: number
  status: string
  dateIssued: string | null
  expiryDate: string | null
  dateRedeemed: string | null
}
