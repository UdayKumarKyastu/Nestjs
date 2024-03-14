import { Controller, Get, Put, Post, Param, Query, Body, Headers } from '@nestjs/common'

import { AuthService } from '../auth/auth.service'

import { CustomersService } from './customers.service'
import { CustomerSearchResult } from './dto/customer-search-result'
import { UpdateUserDto } from './dto/update-user.dto'
import { Customer } from './models/customer'
import { LoyaltyDto } from './dto/loyalty.dto'
import { RefundInvoiceDto } from './dto/refund-invoice.dto'
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto'

@Controller('/v1/customer-service')
export class CustomersContoller {
  constructor(
    private readonly _customersService: CustomersService,
    private readonly _authService: AuthService,
  ) {}

  @Get('/customers')
  public async getCustomers(
    @Query('query') query = '',
    @Query('propertyName') propertyName: 'name' | 'email' | 'phone_number',
  ): Promise<CustomerSearchResult[]> {
    return this._customersService.getAuth0Users(query, propertyName)
  }

  @Get('/customers/:id')
  public async getUserById(@Param('id') id: string): Promise<Customer> {
    return this._customersService.getUserById(id)
  }

  @Put('/customers/:id/update')
  public async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<void> {
    return this._customersService.updateUser(id, body)
  }

  @Get('/customers/:id/subscriptions')
  public async getCustomerSubscriptions(@Param('id') id: string): Promise<any> {
    return this._customersService.getCustomerSubscriptions(id)
  }

  @Post('/customers/:id/subscriptions/:subscriptionId/pause')
  public async pauseSubscription(@Param('subscriptionId') subscriptionId: string): Promise<void> {
    return this._customersService.pauseSubscription(subscriptionId)
  }

  @Post('/customers/:id/subscriptions/:subscriptionId/resume')
  public async resumeSubscription(@Param('subscriptionId') subscriptionId: string): Promise<void> {
    return this._customersService.resumeSubscription(subscriptionId)
  }

  @Post('/customers/:id/subscriptions/:subscriptionId/cancel')
  public async cancelSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body() body: CancelSubscriptionDto,
    @Headers() headers: any,
  ): Promise<void> {
    const authHeader = headers['x-forwarded-authorization'] || headers['authorization'] || ''
    const user = await this._authService.getUser(authHeader.replace('Bearer ', ''))

    return this._customersService.cancelSubscription(subscriptionId, body, user?.name)
  }

  @Post('/customers/:id/subscriptions/:subscriptionId/reactivate')
  public async reactivateSubscription(
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<void> {
    return this._customersService.reactivateSubscription(subscriptionId)
  }

  @Get('/customers/:id/invoices')
  public async getCustomerInvoices(@Param('id') id: string): Promise<any> {
    return this._customersService.getCustomerInvoices(id)
  }

  @Get('/customers/:id/invoices/:invoiceId/download')
  public async downloadInvoice(@Param('invoiceId') invoiceId: string): Promise<any> {
    return this._customersService.downloadInvoice(invoiceId)
  }

  @Post('/customers/:id/invoices/:invoiceId/refund')
  public async refundInvoice(
    @Param('invoiceId') invoiceId: string,
    @Body() body: RefundInvoiceDto,
  ): Promise<void> {
    return this._customersService.refundInvoice(invoiceId, body)
  }

  @Get('/refund-reasons')
  public async getRefundReasons(): Promise<{ key: string; label: string }[]> {
    return this._customersService.getRefundReasons()
  }

  @Post('/customers/:id/invoices/:invoiceId/void')
  public async voidInvoice(@Param('invoiceId') invoiceId: string): Promise<void> {
    return this._customersService.voidInvoice(invoiceId)
  }

  @Get('/customers/:id/loyalty/:walletId')
  public async getLoyaltyDetails(@Param('walletId') walletId: string): Promise<LoyaltyDto> {
    return this._customersService.getLoyaltyDetails(walletId)
  }

  @Post('/customers/:id/loyalty/:walletId/rewards/:rewardId/activate')
  public async activateReward(@Param('rewardId') rewardId: string): Promise<void> {
    return this._customersService.activateReward(rewardId)
  }
}
