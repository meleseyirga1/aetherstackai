import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    return NextResponse.json({ message: "AetherStack AI Webhook Active" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
