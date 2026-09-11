// ═══════════════════════════════════════════════════
// Razorpay Checkout Integration
// ═══════════════════════════════════════════════════

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TVXzb1JAdNEiSG';

/**
 * Load Razorpay script dynamically (if not already loaded)
 */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay payment modal
 * @param {Object} options
 * @param {number} options.amount - Amount in INR (will be multiplied by 100 for paise)
 * @param {string} options.orderId - Order reference number
 * @param {string} options.customerName - Customer name
 * @param {string} options.customerEmail - Customer email
 * @param {string} options.customerPhone - Customer phone
 * @param {string} options.description - Payment description
 * @returns {Promise<{success: boolean, paymentId?: string, error?: string}>}
 */
export async function openRazorpayCheckout({
  amount,
  orderId,
  customerName = 'Customer',
  customerEmail = '',
  customerPhone = '',
  description = 'Amazon Clone Purchase',
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    return { success: false, error: 'Failed to load Razorpay SDK. Check your internet connection.' };
  }

  return new Promise((resolve) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      name: 'Amazon Clone',
      description,
      order_id: undefined, // In test mode, order_id is optional
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },
      notes: {
        order_ref: orderId,
      },
      theme: {
        color: '#131921',
        backdrop_color: 'rgba(0,0,0,0.7)',
      },
      modal: {
        ondismiss: () => {
          resolve({ success: false, error: 'Payment cancelled by user' });
        },
      },
      handler: (response) => {
        // Payment successful
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        resolve({
          success: false,
          error: response.error?.description || 'Payment failed',
          code: response.error?.code,
        });
      });
      rzp.open();
    } catch (err) {
      resolve({ success: false, error: 'Failed to open payment window' });
    }
  });
}

export default { openRazorpayCheckout };
