/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace 'your_stripe_secret_key' with your actual Stripe secret key
const { createClient } = require('@supabase/supabase-js');
const AWS = require('aws-sdk');

const app = express();
app.use(bodyParser.json());

// Initialize Supabase client
const supabase = createClient('https://oiljglujpxrykeabezwz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbmJyc2Vuc2NsZWtxaXB1YmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2NjY0NzAsImV4cCI6MjAwNTI0MjQ3MH0.Zie-feJ4a2U_t19fxmqrzSVpMkp54u2fKBGyg2oHWYA'); // Replace 'your_supabase_url' and 'your_supabase_key' with your actual Supabase URL and key

// Initialize AWS Secrets Manager client
const secretsManager = new AWS.SecretsManager({
  region: 'eu-central-1', // AWS region
});

// Lambda handler function
const lambdaHandler = async (event, context) => {
  // Stripe secret key and webhook signing secret
  let secrets;
  try {
    secrets = await getSecret('subscription_mgmt');
    stripe.api_key = secrets.stripe_api_key;
  } catch (error) {
    console.error('Error retrieving secrets:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }

  const payload = event.body;
  const sigHeader = event.headers['Stripe-Signature'];

  try {
    // Verify and construct the event
    const stripeEvent = stripe.webhooks.constructEvent(payload, sigHeader, secrets.stripe_endpoint_secret);
    
    // Handle the event
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      console.log(`Checkout session completed: ${session.id}`);

      const user = parseInt(session.client_reference_id);
      const customerId = session.customer;

      assignCustomer(user, customerId, secrets);
    } else if (stripeEvent.type === 'invoice.payment_succeeded') {
      const invoice = stripeEvent.data.object;
      console.log(`Invoice payment succeeded: ${invoice.id}`);

      const tenantId = invoice.customer;
      const productId = invoice.lines.data[0].price.id;
      const subscriptionId = invoice.subscription;

      changePlan(tenantId, productId, subscriptionId, secrets);
    } else if (stripeEvent.type === 'customer.subscription.deleted') {
      const subscription = stripeEvent.data.object;
      console.log(`Subscription deleted: ${subscription.id}`);

      cancelSubscription(subscription.id, subscription.current_period_end, secrets);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Received' }),
    };
  } catch (error) {
    console.error('Error handling Stripe event:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid payload' }),
    };
  }
};

// Assign customer to Supabase tenant
const assignCustomer = async (userId, customerId, secrets) => {
  try {
    const { data, error } = await supabase.from('TenantUser').select('tenant_id').eq('user', userId).single();
    if (error) throw error;

    const tenantId = data.tenant_id;
    const now = new Date().toISOString();

    await supabase.from('Tenant').update({ stripe_customer_id: customerId, updated_at: now }).eq('id', tenantId);
  } catch (error) {
    console.error('Error assigning customer:', error);
  }
};

// Change subscription plan in Supabase
const changePlan = async (stripeCustomerId, plan, subscriptionId, secrets) => {
  try {
    let tenantId;
    for (let i = 0; i < 10; i++) {
      const { data, error } = await supabase.from('Tenant').select('id').eq('stripe_customer_id', stripeCustomerId).single();
      if (error) throw error;

      if (data) {
        tenantId = data.id;
        break;
      } else {
        await sleep(1000); // Wait for Stripe to update
      }
    }

    let expiry;
    if (plan === 'price_1PQ5jP07SwzennMJmoNpav0v') {
      plan = 2;
      expiry = new Date().getTime() + 365 * 24 * 60 * 60 * 1000;
    } else if (plan === 'prctbl_1ObiuNEVAJm5oLdhGEeSbNA3') {
      plan = 2;
      expiry = new Date().getTime() + 33 * 24 * 60 * 60 * 1000;
    } else if (plan === 'prctbl_1ObiuNEVAJm5oLdhGEeSbNA3') {
      plan = 2;
      expiry = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
    }

    if (plan) {
      expiry = new Date(expiry).toISOString();
      const now = new Date().toISOString();

      await supabase.from('TenantPlan').update({ plan_id: plan, updated_at: now, end_date: null, stripe_subscription_id: subscriptionId }).eq('tenant_id', tenantId);
    }
  } catch (error) {
    console.error('Error changing plan:', error);
  }
};

// Cancel subscription in Supabase
const cancelSubscription = async (subscriptionId, expirationDate, secrets) => {
  try {
    const now = new Date().toISOString();
    const expirationDateISO = new Date(expirationDate * 1000).toISOString();

    await supabase.from('TenantPlan').update({ updated_at: now, end_date: expirationDateISO }).eq('stripe_subscription_id', subscriptionId);
  } catch (error) {
    console.error('Error canceling subscription:', error);
  }
};

// Retrieve secrets from AWS Secrets Manager
const getSecret = async (secretName) => {
  try {
    const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    return JSON.parse(secret.SecretString);
  } catch (error) {
    throw error;
  }
};

// Helper function to sleep
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Route for Stripe webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    await lambdaHandler(event, null); // Call Lambda handler function
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
