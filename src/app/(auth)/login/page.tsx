'use client'

import { useState } from 'react'
import Link from 'next/link'
import { loginUser } from '@/lib/actions/auth'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      await loginUser(data)
    } catch (err: any) {
      setError(err.message || 'Gagal masuk')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Kinetic Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="mb-24 text-center">
          <div className="flex justify-center items-center gap-4 mb-10">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span className="ev-label !mb-0 tracking-[0.8em]">AUTH_PROTOCOL_v2.0</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-black uppercase tracking-[-0.06em] leading-[0.85] italic mb-6">
            WELCOME_BACK<br/>
            <span className="text-white/10">ACCESS_ID.</span>
          </h1>
        </div>

        <div className="ev-border p-12 bg-white/[0.01] backdrop-blur-xl relative group">
          {/* Decorative Corner */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-white/20" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-white/20" />

          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="space-y-4">
              <label className="ev-label !mb-2 opacity-30">ENCRYPTED_EMAIL</label>
              <input 
                name="email"
                type="email"
                placeholder="USER@DOMAIN.COM"
                className="w-full bg-transparent border-b border-white/5 py-4 text-2xl font-black tracking-tight text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="ev-label !mb-2 opacity-30">SECURE_PASSPHRASE</label>
              <input 
                name="password"
                type="password"
                placeholder="********"
                className="w-full bg-transparent border-b border-white/5 py-4 text-2xl font-black tracking-tight text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 border border-rose-500/20 bg-rose-500/5 text-rose-500 font-mono text-[10px] uppercase tracking-widest text-center"
              >
                [ FATAL_ERROR ] : {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              className="ev-btn w-full !py-10 text-[11px] font-black bg-white text-black hover:bg-lime-400 border-none transition-all duration-1000"
              disabled={loading}
            >
              {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE_SESSION'}
            </button>
          </form>
        </div>

        <div className="mt-16 flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="ev-label !mb-0 opacity-20">PENDING_STATUS</span>
          </div>
          <Link href="/register" className="ev-label !mb-0 text-white/40 hover:text-white transition-colors">
            CREATE_NEW_NODE_01
          </Link>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <span className="ev-label !text-[8px] opacity-10">COORD_X: 52.5200° N</span>
      </div>
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <span className="ev-label !text-[8px] opacity-10">COORD_Y: 13.4050° E</span>
      </div>
    </div>
  )
}