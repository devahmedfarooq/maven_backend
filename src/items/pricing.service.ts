import { Injectable } from '@nestjs/common';

export interface PriceOption {
  cost: number;
  type: string;
  isActive: boolean;
  minQuantity: number;
  maxQuantity?: number;
  description?: string;
  currency: string;
}

export interface PricingSummary {
  subtotal: number;
  gst: number;
  total: number;
  currency: string;
  items: Array<{
    name: string;
    cost: number;
    quantity: number;
    type: string;
  }>;
}

@Injectable()
export class PricingService {
  private readonly GST_RATE = 0.18; // 18% GST

  /**
   * Get the default price from a price array
   */
  getDefaultPrice(prices: PriceOption[]): PriceOption | null {
    if (!prices || prices.length === 0) return null;
    
    // Return the first active price, or the first price if none are active
    const activePrice = prices.find(p => p.isActive);
    return activePrice || prices[0];
  }

  /**
   * Get all active prices
   */
  getActivePrices(prices: PriceOption[]): PriceOption[] {
    if (!prices) return [];
    return prices.filter(p => p.isActive);
  }

  /**
   * Calculate pricing summary for a booking
   */
  calculatePricingSummary(
    items: Array<{
      name: string;
      price: PriceOption;
      quantity: number;
    }>,
    currency: string = 'PKR'
  ): PricingSummary {
    const summaryItems = items.map(item => ({
      name: item.name,
      cost: item.price.cost,
      quantity: item.quantity,
      type: item.price.type,
    }));

    const subtotal = summaryItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    const gst = subtotal * this.GST_RATE;
    const total = subtotal + gst;

    return {
      subtotal,
      gst,
      total,
      currency,
      items: summaryItems,
    };
  }

  /**
   * Validate price data
   */
  validatePrice(price: any): price is PriceOption {
    return (
      price &&
      typeof price.cost === 'number' &&
      price.cost >= 0 &&
      typeof price.type === 'string' &&
      price.type.trim() !== ''
    );
  }

  /**
   * Format price for display
   */
  formatPrice(cost: number, currency: string = 'PKR'): string {
    return `${currency} ${cost.toLocaleString()}`;
  }

  /**
   * Get price by type
   */
  getPriceByType(prices: PriceOption[], type: string): PriceOption | null {
    if (!prices) return null;
    return prices.find(p => p.type === type && p.isActive) || null;
  }
} 