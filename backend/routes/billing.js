const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'your-stripe-key');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, checkLimit } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate subscription price
function getPriceByTier(tier) {
  const prices = {
    free: 0,
    pro: 9999, // Price in cents
    enterprise: 49999 // Price in cents
  };
  return prices[tier];
}

// @route   POST /api/billing/subscribe
// @desc    Subscribe to a plan
// @access  Private
router.post('/subscribe', authenticateToken, [
  body('tier').isIn(['pro', 'enterprise']).withMessage('Tier must be pro or enterprise'),
  body('paymentMethodId').notEmpty().withMessage('Payment method ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { tier, paymentMethodId } = req.body;
    const user = req.user;

    // Check if tier is already subscribed
    if (user.subscription.tier === tier && user.subscription.status === 'active') {
      return res.status(400).json({
        error: 'Already subscribed',
        message: 'You are already subscribed to this tier'
      });
    }

    // Calculate price based on tier
    const price = getPriceByTier(tier);

    // Create Stripe customer if not existing
    if (!user.subscription.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      user.subscription.stripeCustomerId = customer.id;
    }

    // Update payment method
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.subscription.stripeCustomerId
    });

    await stripe.customers.update(user.subscription.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: user.subscription.stripeCustomerId,
      items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`
          },
          unit_amount: price
        }
      }],
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user._id.toString(),
        tier
      }
    });

    // Update user subscription
    user.subscription.tier = tier;
    user.subscription.status = 'active';
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    await user.save();

    res.json({
      message: 'Subscription successful',
      subscription
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      error: 'Subscription failed',
      message: 'Internal server error during subscription'
    });
  }
});

// @route   POST /api/billing/cancel
// @desc    Cancel a subscription
// @access  Private
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Check if subscription exists
    if (!user.subscription.stripeSubscriptionId) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'No active subscription found'
      });
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.del(user.subscription.stripeSubscriptionId);

    // Update user subscription
    user.subscription.status = 'canceled';
    user.subscription.cancelAtPeriodEnd = true;

    await user.save();

    res.json({
      message: 'Subscription canceled successfully'
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      error: 'Cancellation failed',
      message: 'Internal server error during subscription cancellation'
    });
  }
});

// @route   POST /api/billing/webhook
// @desc    Stripe webhook to handle subscription events
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'your-webhook-secret';
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Handle different event types
    if (event.type === 'invoice.payment_failed') {
      const subscriptionId = event.data.object.subscription;

      // Find user by subscription ID
      User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId })
        .then(user => {
          if (user) {
            user.subscription.status = 'past_due';
            user.save().then(() => console.log('User subscription updated to past_due'));
          }
        })
        .catch(err => console.error('User update error:', err));
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: 'Webhook Error', message: err.message });
  }
});

module.exports = router;

