'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerUser } from '@/lib/actions/auth'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      await registerUser(data)
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Kinetic Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '60px 60px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="mb-24 text-left">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-8 h-[1px] bg-lime-400" />
            <span className="ev-label !mb-0 tracking-[0.6em]">REGISTRATION_NODE_v1.4</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,6rem)] font-black uppercase tracking-[-0.06em] leading-[0.85] italic mb-6">
            CREATE_CORE<br/>
            <span className="text-white/10 outline-text">ACCOUNT.</span>
          </h1>
        </div>

        <div className="ev-border p-12 bg-white/[0.01] backdrop-blur-xl relative">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="ev-label !mb-2 opacity-30">FULL_IDENTIFIER</label>
                <input 
                  name="fullName"
                  placeholder="EX: TEGAR_ARJUNA"
                  className="w-full bg-transparent border-b border-white/5 py-4 text-xl font-black tracking-tight text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="ev-label !mb-2 opacity-30">ENCRYPTED_EMAIL</label>
                <input 
                  name="email"
                  type="email"
                  placeholder="USER@DOMAIN.COM"
                  className="w-full bg-transparent border-b border-white/5 py-4 text-xl font-black tracking-tight text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="ev-label !mb-2 opacity-30">MASTER_PASSPHRASE</label>
              <input 
                name="password"
                type="password"
                placeholder="MIN_6_CHARACTERS"
                minLength={6}
                className="w-full bg-transparent border-b border-white/5 py-4 text-xl font-black tracking-tight text-white focus:outline-none focus:border-white transition-all placeholder:text-white/5"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 border border-rose-500/20 bg-rose-500/5 text-rose-500 font-mono text-[10px] uppercase tracking-widest text-center"
              >
                [ UPLINK_FAILED ] : {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              className="ev-btn w-full !py-10 text-[11px] font-black bg-white text-black hover:bg-lime-400 border-none transition-all duration-1000"
              disabled={loading}
            >
              {loading ? 'INITIALIZING...' : 'INITIALIZE_CORE_ACCOUNT'}
            </button>
          </form>
        </div>

        <div className="mt-16 flex justify-between items-center px-4">
          <div className="flex items-center gap-4 text-white/20">
            <span className="font-mono text-[10px]">ENCRYPTION_AES_256</span>
          </div>
          <Link href="/login" className="ev-label !mb-0 text-white/40 hover:text-white transition-colors">
            EXISTING_USER_ACCESS
          </Link>
        </div>
      </motion.div>

      <style jsx global>{`
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          color: transparent;
        }
      `}</style>
    </div>
  )
}