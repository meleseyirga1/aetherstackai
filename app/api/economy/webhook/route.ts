import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { NodeSSH } from 'node-ssh';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-12-15.clover' as any });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === 'checkout.session.completed') {
      const ssh = new NodeSSH();
      await ssh.connect({ host: '143.110.195.79', username: 'root', password: 'rdmmmichael2013' });
      // Execute credit deposit on the VPS physical ledger
      await ssh.execCommand(`python3 /opt/aetherstack/scripts/economy_sync.py 1000`);
      ssh.dispose();
    }
    return NextResponse.json({ status: 'SUCCESS' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}