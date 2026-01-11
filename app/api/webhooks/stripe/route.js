import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { NodeSSH } from 'node-ssh';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const credits = (session.amount_total / 100) * 100;

      const ssh = new NodeSSH();
      await ssh.connect({
        host: process.env.VPS_IP,
        username: 'root',
        password: process.env.VPS_PASSWORD
      });

      // Synchronize credits to the physical VPS ledger
      await ssh.execCommand(`python3 /opt/aetherstack/scripts/economy_sync.py ${credits}`);
      ssh.dispose();
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}