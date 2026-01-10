import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { NodeSSH } from 'node-ssh';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    // 1. Verify the signature comes from Stripe
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
  }

  // 2. Handle the successful payment event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const amount = session.amount_total / 100; // Total in USD
    const credits = amount * 100; // $1 = 100 IU

    console.log(`💰 Payment detected: $${amount}. Provisioning ${credits} credits...`);

    const ssh = new NodeSSH();
    try {
      // 3. Handshake with NYC-01 Root to update physical credits
      await ssh.connect({
        host: process.env.VPS_IP,
        username: 'root',
        password: process.env.VPS_PASSWORD
      });

      await ssh.execCommand(`python3 /opt/aetherstack/scripts/economy_sync.py ${credits}`);
      ssh.dispose();
      console.log('✅ Credits anchored to VPS Ledger.');
    } catch (sshErr) {
      console.error('❌ Failed to connect to VPS:', sshErr);
    }
  }

  return NextResponse.json({ received: true });
}