const axios = require('axios');

class LemonSqueezyAPI {
  constructor() {
    this.apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    this.storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    this.webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    this.baseURL = 'https://api.lemonsqueezy.com/v1';
    
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    };
  }

  // Create a checkout session
  async createCheckout(variantId, customerEmail, customData = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/checkouts`, {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: customerEmail,
              custom: customData
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: this.storeId
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId
              }
            }
          }
        }
      }, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('❌ Lemon Squeezy checkout creation failed:', error.response?.data || error.message);
      throw new Error('Failed to create checkout session');
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const response = await axios.get(`${this.baseURL}/subscriptions/${subscriptionId}`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get subscription:', error.response?.data || error.message);
      throw new Error('Failed to get subscription details');
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await axios.patch(`${this.baseURL}/subscriptions/${subscriptionId}`, {
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: {
            cancelled: true
          }
        }
      }, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to cancel subscription:', error.response?.data || error.message);
      throw new Error('Failed to cancel subscription');
    }
  }

  // Get customer details
  async getCustomer(customerId) {
    try {
      const response = await axios.get(`${this.baseURL}/customers/${customerId}`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get customer:', error.response?.data || error.message);
      throw new Error('Failed to get customer details');
    }
  }

  // Get order details
  async getOrder(orderId) {
    try {
      const response = await axios.get(`${this.baseURL}/orders/${orderId}`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get order:', error.response?.data || error.message);
      throw new Error('Failed to get order details');
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', this.webhookSecret);
    hmac.update(payload);
    const digest = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(digest, 'hex')
    );
  }

  // Get available products/variants
  async getProducts() {
    try {
      const response = await axios.get(`${this.baseURL}/products?filter[store_id]=${this.storeId}`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get products:', error.response?.data || error.message);
      throw new Error('Failed to get products');
    }
  }

  // Get variants for a product
  async getVariants(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/variants?filter[product_id]=${productId}`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to get variants:', error.response?.data || error.message);
      throw new Error('Failed to get variants');
    }
  }
}

module.exports = new LemonSqueezyAPI();
