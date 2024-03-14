import { Inject, Injectable } from '@nestjs/common'
import { ChargeBee, _invoice } from 'chargebee-typescript'
import { Result } from 'chargebee-typescript/lib/result'
import { Customer } from 'chargebee-typescript/lib/resources/customer'
import { Subscription } from 'chargebee-typescript/lib/resources/subscription'
import { sortBy } from 'lodash'
import { CancelSubscriptionDto } from 'src/modules/customers/dto/cancel-subscription.dto'

import { RefundInvoiceDto } from '../dto/refund-invoice.dto'

import { ChargeBeeConfigService } from './chargebee-config.service'

@Injectable()
export class ChargebeeService {
  private readonly chargebee: ChargeBee

  constructor(@Inject(ChargeBeeConfigService) chargeBeeConfigService: ChargeBeeConfigService) {
    this.chargebee = new ChargeBee()
    this.chargebee.configure({
      site: chargeBeeConfigService.projectName,
      api_key: chargeBeeConfigService.apiKey,
    })
  }

  private formatTimestamp(timestamp?: number) {
    return timestamp && timestamp * 1000
  }

  async getSubscriptionsForCustomer(customerId: string) {
    const data = (await this.chargebee.subscription
      .subscriptions_for_customer(customerId)
      .request()) as any as { list: Result[] }

    return await Promise.all(
      data.list.map(async (result) => {
        const { plan } = await this.chargebee.plan.retrieve(result.subscription.plan_id).request()

        const {
          id,
          start_date,
          current_term_start,
          current_term_end,
          next_billing_at,
          created_at,
          started_at,
          status,
          activated_at,
          cf_preferred_state_sub,
        } = result.subscription as Subscription & { cf_preferred_state_sub?: string }

        return {
          id,
          start_date,
          current_term_start: this.formatTimestamp(current_term_start),
          current_term_end: this.formatTimestamp(current_term_end),
          next_billing_at: this.formatTimestamp(next_billing_at),
          created_at: this.formatTimestamp(created_at),
          started_at: this.formatTimestamp(started_at),
          status,
          activated_at: this.formatTimestamp(activated_at),
          plan_name: plan.name,
          preferred_state: cf_preferred_state_sub ?? null,
        }
      }),
    )
  }

  async getInvoicesForCustomer(customerId: string) {
    const data = await (this.chargebee.invoice
      .invoices_for_customer(customerId)
      .request() as any as { list: Result[] })

    return await Promise.all(
      data.list.map(async (result) => {
        const { id, paid_at, amount_paid, status, currency_code, updated_at } = result.invoice

        const transactionId = sortBy(
          result.invoice.linked_payments,
          ({ txn_date }) => -txn_date!,
        )[0]?.txn_id
        const { transaction } = transactionId
          ? await this.chargebee.transaction.retrieve(transactionId).request()
          : { transaction: null }

        const refundedAmount = (result.invoice.issued_credit_notes || []).reduce(
          (acc, credit_note) => {
            return (acc += credit_note.cn_total || 0)
          },
          0,
        )

        return {
          id,
          transaction_id: transaction?.id_at_gateway || null,
          payment_method: transaction?.payment_method,
          paid_at: this.formatTimestamp(paid_at),
          amount_paid,
          status,
          currency_code,
          updated_at: this.formatTimestamp(updated_at),
          amount_refunded: refundedAmount,
        }
      }),
    )
  }

  async downloadInvoice(invoiceId: string) {
    const data = await this.chargebee.invoice.pdf(invoiceId).request()

    return data.download
  }

  async refundInvoice(invoiceId: string, data: RefundInvoiceDto): Promise<void> {
    const refundParams: _invoice.refund_params = {}
    const { refund_amount, reason_code, comment } = data

    if (refund_amount) {
      refundParams.refund_amount = refund_amount
    }

    if (reason_code) {
      refundParams.credit_note = {
        reason_code: reason_code,
      }
    }

    if (comment) {
      refundParams.comment = comment
    }

    await this.chargebee.invoice.refund(invoiceId, refundParams).request()
  }

  async voidInvoice(invoiceId: string): Promise<void> {
    await this.chargebee.invoice.void_invoice(invoiceId).request()
  }

  async cancelSubscription(
    subscriptionId: string,
    body: CancelSubscriptionDto,
    auth0Username?: string,
  ): Promise<void> {
    await this.chargebee.subscription
      .cancel(subscriptionId, {
        credit_option_for_current_term_charges: 'none',
        end_of_term: body.cancelEndOfTerm,
      })
      .request()
    if (body.comment) {
      await this.chargebee.comment
        .create({
          entity_id: subscriptionId,
          entity_type: 'subscription',
          notes: body.comment,
          added_by: auth0Username,
        })
        .request()
    }
  }

  async reactivateSubscription(subscriptionId: string): Promise<void> {
    await this.chargebee.subscription.reactivate(subscriptionId).request()
  }

  async pauseSubscription(subscriptionId: string): Promise<void> {
    await this.chargebee.subscription
      .pause(subscriptionId, { pause_option: 'immediately' })
      .request()
  }

  async resumeSubscription(subscriptionId: string): Promise<void> {
    await this.chargebee.subscription.resume(subscriptionId).request()
  }

  async getCustomer(customerId: string): Promise<Customer> {
    const data = await this.chargebee.customer.retrieve(customerId).request()

    return data.customer
  }
}
