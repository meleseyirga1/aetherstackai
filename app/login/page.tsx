"use client"
import { createBrowserClient } from '@supabase/ssr'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    setMounted(true)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.push('/')
    })
    return () => subscription.unsubscribe()
  }, [router, supabase])

  if (!mounted) return null

  return (
    <div style={{ background: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#050505', border: '1px solid #111', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
        <img src="/logo-full.png" alt="AetherStack" style={{ height: '40px', margin: '0 auto 30px' }} />
        <h2 style={{ color: 'white', fontSize: '14px', fontWeight: '900', marginBottom: '20px', letterSpacing: '2px' }}>SOVEREIGN_AUTH_GATE</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
          redirectTo="http://localhost:3000"
        />
      </div>
    </div>
  )
}