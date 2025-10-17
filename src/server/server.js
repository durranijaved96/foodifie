/* eslint-disable no-unused-vars */
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // Supabase client

const app = express();
const port = 3001;


// Initialize Supabase client
const supabase = createClient('https://oiljglujpxrykeabezwz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pbGpnbHVqcHhyeWtlYWJlend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjUwNzMsImV4cCI6MjA3NDQwMTA3M30.bsnhTBrv-LW_xIOgqMzcBg3OF-UPWvWBnLOKG_UsZSc');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json()); // Use bodyParser to parse JSON requests
app.use(bodyParser.raw({ type: 'application/json' }));


app.use(cors());
app.use(cors());
// Function to get customer ID based on user ID from Supabase
const getTenantIdFromUserId = async (userId) => {
    try {
      if (!supabase) {
        console.error("Supabase client is not available.");
        return null;
      }
  
      // Fetch tenant data using user_id
      const { data: tenantData, error: tenantError } = await supabase
        .from("TenantUser")
        .select("tenant_id")
        .eq("user", userId)
        .single();
  
      if (tenantError) {
        console.error("Error fetching tenant data:", tenantError.message);
        return null;
      }
  
      if (!tenantData || !tenantData.tenant_id) {
        console.error("Tenant data not found for user ID:", userId);
        return null;
      }
  
      // Return the retrieved tenant_id
      return tenantData.tenant_id;
    } catch (error) {
      console.error("Error fetching tenant ID:", error.message);
      return null;
    }
  };
  

// Function to grant user access to purchased product
async function getTenantId(userId) {
    try {
        const { data: tenantUserData, error: tenantUserError } = await supabase
            .from('TenantUser')
            .select('tenant_id')
            .eq('user', userId)
            .single();

        if (tenantUserError) {
            throw tenantUserError;
        }

        return tenantUserData.tenant_id;
    } catch (error) {
        console.error('Error getting tenant ID:', error.message);
        throw error;
    }
}

// Function to update entry in TenantPlan with new subscription
async function updateTenantPlan(tenantId, priceId) {
    try {
        console.log('Updating tenant plan...');
        console.log('Tenant ID:', tenantId);
        console.log('Price ID:', priceId);

        const now = new Date();
        const startDate = now.toISOString();
        const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Assuming 30 days subscription

        const { error: updateError } = await supabase
            .from('TenantPlan')
            .update({ 'plan_id': priceId, 'start_date': startDate, 'end_date': endDate , 'updated_at': now})
            .eq('tenant_id', tenantId);

        if (updateError) {
            console.error('Error updating TenantPlan:', updateError.message);
            throw updateError;
        } else {
            console.log('Tenant plan updated successfully.');
        }
    } catch (error) {
        console.error('Error updating TenantPlan:', error.message);
        throw error;
    }
}


// Endpoint to create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { priceId, userId } = req.body;

        console.log('Creating checkout session...');
        console.log('Price ID:', priceId);
        console.log('User ID:', userId);
        // define list of country codes for EU + UK
        const countryCodesList = [ 'DE', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR','GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB'];

        // Fetch tenantId based on userId
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'paypal'],//only card and paypal for now
            line_items: [{ price: priceId, quantity: 1 }],
            automatic_tax: { enabled: true },
            billing_address_collection: 'required',
            //customer: userId,
            client_reference_id: userId,
            mode: 'subscription',
            success_url: 'https://app.com/success',
            cancel_url: 'https://app.com/cancel',
            allow_promotion_codes: true,
            tax_id_collection: { enabled: true },
            shipping_address_collection: { allowed_countries: countryCodesList }
            //metadata: { 'user_id': userId }
        });
        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
});

  
// Endpoint to handle webhook events from Stripe
app.post('/webhook', async (req, res) => {
    const endpointSecret = "whsec_2ab9c7d9af6d44f8a9460e849806ecb7d51525fa1d773ea33011f0db26f88551";
    const sig = req.headers['stripe-signature'];
    const rawBody = req.rawBody.toString(); // Get the raw request body as a string

    try {
        const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        console.log('Received webhook event:', event.type);

        switch (event.type) {
            case 'checkout.session.completed':
                console.log('Handling checkout session completed event');
                const session = event.data.object;
                const priceId = session.display_items[0].price.id;
                const customerId = session.customer;

                // Extracting user ID from the session object
                const userId = session.client_reference_id;

                // Get Tenant ID via TenantUser from User ID
                const tenantId = await getTenantId(customerId);

                // Update TenantPlan with new subscription
                await updateTenantPlan(tenantId, priceId);

                // Save any necessary data or update user information in Supabase
                const userTenantData = await getUserTenantData(userId);
                const userTenantId = userTenantData.tenant_id;
                // Update Supabase data for the user, e.g., plan, subscription status, etc.
                await updateSupabaseData(userTenantId, priceId);

                break;
            case 'checkout.session.payment_failed':
                console.log('Handling payment failed event');
                console.log('Payment failed for session:', event.data.object.id);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received : true });
    } catch (err) {
        console.error('Error handling webhook event:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
// Function to fetch Supabase data for the user
async function getUserTenantData(userId) {
    try {
        // Fetch Supabase data for the user using userId
        const { data, error } = await supabase
            .from('TenantUser')
            .select('tenant_id')
            .eq('user', userId)
            .single();

        if (error) {
            console.error('Error fetching Supabase data for user:', error.message);
            throw error;
        }

        return data; // Return the fetched data
    } catch (error) {
        console.error('Error fetching Supabase data for user:', error.message);
        throw error;
    }
}

// Function to update Supabase data for the user after payment
async function updateSupabaseData(tenantId, priceId) {
    try {
        // Update the user's plan in the Supabase table 'TenantPlan' based on tenantId and priceId
         await supabase
            .from('TenantPlan')
            .update({ 'plan_id': priceId })
            .eq('tenant_id', tenantId);

        console.log('Supabase data updated successfully.');
    } catch (error) {
        console.error('Error updating Supabase data for user:', error.message);
        throw error;
    }
}


// Endpoint to create a checkout session


/*app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, customerId, userId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            billing_address_collection: 'required',
            customer: customerId,
            client_reference_id: userId, // Make sure userId is passed here
            mode: 'subscription',
            success_url: 'https://app.com/success',
            cancel_url: 'https://app.com/cancel',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
});*/


// Endpoint to handle successful payment
app.post('/success', async function (req, res) {
    var session_id = req.query.mysessionid;
    res.send(`<html><body><h1>Thanks for your order!</h1></body></html>`);
});

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
