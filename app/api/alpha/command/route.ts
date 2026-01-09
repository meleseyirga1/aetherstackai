import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';

export async function POST(req: Request) {
  const cookieStore = await cookies(); 
  const { command } = await req.json();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value; } } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const userEmail = session?.user?.email || "Founder";

  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '143.110.195.79',
      username: 'root',
      password: 'rdmmmichael2013',
      readyTimeout: 10000,
      algorithms: { serverHostKey: [ 'ssh-ed25519', 'ssh-rsa' ] }
    });
    
    const result = await ssh.execCommand(`python3 /opt/aetherstack/scripts/alpha_core.py "${command}" "${userEmail}"`);
    
    // NOISE FILTER: Find the first '{' and last '}'
    const raw = result.stdout.trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}') + 1;
    
    if (start === -1 || end === 0) {
        throw new Error("Invalid Brain response: " + raw);
    }

    const cleanJson = JSON.parse(raw.substring(start, end));
    return NextResponse.json(cleanJson);

  } catch (e: any) {
    console.error('Sovereign Link Failure:', e.message);
    return NextResponse.json({ error: 'LINK_FAILURE', details: e.message }, { status: 200 }); 
  } finally {
    ssh.dispose();
  }
}