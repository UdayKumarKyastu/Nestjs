import { Injectable } from '@nestjs/common'
import { User } from 'auth0'
import { HttpService } from '@nestjs/axios'

import { CountryCode } from '../../shared/model/country-code'

import { Auth0ClientService } from './auth0-client.service'
import { CustomerSearchResult } from './dto/customer-search-result'
import { ChargebeeService } from './chargebee/chargebee.service'
import { LoyaltyService } from './loyalty/loyalty.service'
import { Customer } from './models/customer'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoyaltyDto } from './dto/loyalty.dto'
import { RefundInvoiceDto } from './dto/refund-invoice.dto'
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto'

const countryCodes: { [key: string]: CountryCode } = {
  'en-gb': CountryCode.UK,
  'en-us': CountryCode.US,
  'fr-fr': CountryCode.FR,
  'en-hk': CountryCode.HK,
}

@Injectable()
export class CustomersService {
  constructor(
    private readonly auth0ClientService: Auth0ClientService,
    private readonly chargebeeService: ChargebeeService,
    private readonly httpService: HttpService,
    private readonly loyaltyService: LoyaltyService,
  ) {}

  async getAuth0Users(
    query: string,
    propertyName: 'name' | 'phone_number' | 'email',
  ): Promise<CustomerSearchResult[]> {
    const users = await this.auth0ClientService.getUsers(query, propertyName)

    return users.map((user: User) => ({
      name: user.name,
      email: user.email,
      user_id: user.user_id,
      phone_number: user.app_metadata?.phone_number,
      country: countryCodes[user.app_metadata?.locale],
      blocked: user.blocked,
      imageUrl: user.picture,
      pret_id: user.app_metadata?.pret_id,
      wallet_id: user.app_metadata?.eeye_wallet_id,
    }))
  }

  async getUserById(id: string): Promise<Customer> {
    const auth0User = await this.auth0ClientService.getUserById(id)
    const chargeBeeCustomer = await this.chargebeeService.getCustomer(
      auth0User.app_metadata.cbee_id,
    )

    return {
      ...auth0User,
      billing_address: chargeBeeCustomer.billing_address,
    }
  }

  async updateUser(id: string, body: UpdateUserDto) {
    try {
      await this.auth0ClientService.updateUser(id, body)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async getCustomerSubscriptions(id: string) {
    try {
      return this.chargebeeService.getSubscriptionsForCustomer(id)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async pauseSubscription(id: string) {
    try {
      return this.chargebeeService.pauseSubscription(id)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async resumeSubscription(id: string) {
    try {
      return this.chargebeeService.resumeSubscription(id)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async cancelSubscription(id: string, body: CancelSubscriptionDto, auth0Username?: string) {
    try {
      return this.chargebeeService.cancelSubscription(id, body, auth0Username)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async reactivateSubscription(id: string) {
    try {
      return this.chargebeeService.reactivateSubscription(id)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async getCustomerInvoices(id: string) {
    try {
      return this.chargebeeService.getInvoicesForCustomer(id)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async downloadInvoice(id: string) {
    try {
      return this.chargebeeService.downloadInvoice(id)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async refundInvoice(id: string, data: RefundInvoiceDto) {
    try {
      return this.chargebeeService.refundInvoice(id, data)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async getRefundReasons() {
    return [
      {
        key: 'product_unsatisfactory',
        label: 'Product Unsatisfactory',
      },
      {
        key: 'service_unsatisfactory',
        label: 'Service Unsatisfactory',
      },
      {
        key: 'order_change',
        label: 'Order Change',
      },
      {
        key: 'order_cancellation',
        label: 'Order Cancellation',
      },
      {
        key: 'waiver',
        label: 'Waiver',
      },
      {
        key: 'other',
        label: 'Other',
      },
    ]
  }

  async voidInvoice(id: string) {
    try {
      return this.chargebeeService.voidInvoice(id)
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  async getLoyaltyDetails(id: string): Promise<LoyaltyDto> {
    try {
      const rewards = await this.loyaltyService.getRewards(id)
      const rewardsSummary = await this.loyaltyService.getRewardsSummary(id)

      const rewardCategories = await this.loyaltyService.getRewardCategories()

      return {
        totalNoOfStars: rewardsSummary.totalNoOfStars,
        starsLeftToReward: rewardsSummary.starsLeftToReward,
        rewards: rewards.map((reward: any) => {
          const rewardName =
            rewardCategories.find(
              (category: any) => reward.campaignId.toString() === category.externalId,
            )?.name || ''

          return {
            name: rewardName,
            ...reward,
          }
        }),
      }
    } catch (e: unknown) {
      throw new Error(e as string)
    }
  }

  //TODO: implement
  async activateReward(id: string): Promise<void> {
    return
  }
}
