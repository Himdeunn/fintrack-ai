'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { updateProfile, updatePassword } from '@/lib/actions/auth'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { User, Mail, Lock, Shield, Save, Loader2, Camera } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user } = useUser()
  const { language } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  if (!user) return null

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateProfile(formData)
    
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(language === 'id' ? 'Profil berhasil diperbarui' : 'Profile updated successfully')
    }
    setLoading(false)
  }

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPwLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updatePassword(formData)
    
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(language === 'id' ? 'Kata sandi berhasil diperbarui' : 'Password updated successfully')
      ;(e.target as HTMLFormElement).reset()
    }
    setPwLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo/40 dark:text-vanilla/40 mb-4 block">
          {language === 'id' ? 'Pengaturan Akun' : 'Account Settings'}
        </span>
        <h1 className="text-6xl font-black uppercase tracking-tighter text-indigo dark:text-vanilla leading-none">
          {language === 'id' ? 'Profil' : 'User'} <span className="opacity-40">{language === 'id' ? 'Pengguna' : 'Profile'}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-8">
          <div className="modern-card text-center p-10">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-indigo dark:bg-vanilla text-vanilla dark:text-indigo flex items-center justify-center text-3xl font-black shadow-2xl shadow-indigo/20">
                {user.fullName?.[0] || user.email[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-indigo-muted border-2 border-vanilla dark:border-indigo flex items-center justify-center text-indigo dark:text-vanilla shadow-lg">
                <Camera size={14} />
              </div>
            </div>
            <h3 className="text-xl font-black text-indigo dark:text-vanilla uppercase tracking-tight mb-1">{user.fullName || 'User'}</h3>
            <p className="text-[10px] font-bold text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest">{user.email}</p>
          </div>

          <div className="modern-card p-8 bg-indigo/5 dark:bg-vanilla/5 border-dashed border-2 border-indigo/10 dark:border-vanilla/10">
            <div className="flex items-center gap-4 text-indigo/60 dark:text-vanilla/60 mb-4">
              <Shield size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Security Status</span>
            </div>
            <p className="text-xs font-bold text-indigo/40 dark:text-vanilla/40 leading-relaxed uppercase">
              {language === 'id' 
                ? 'Akun Anda diverifikasi dan dilindungi dengan enkripsi AES-256.' 
                : 'Your account is verified and protected with AES-256 encryption.'}
            </p>
          </div>
        </div>

        {/* Forms */}
        <div className="md:col-span-2 space-y-8">
          {/* General Info */}
          <div className="modern-card">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-indigo/5 dark:border-vanilla/5">
              <div className="p-3 bg-indigo/5 dark:bg-vanilla/5 rounded-xl text-indigo dark:text-vanilla">
                <User size={18} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo/40 dark:text-vanilla/40">
                {language === 'id' ? 'Informasi Umum' : 'General Information'}
              </h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Nama Lengkap' : 'Full Name'}</label>
                  <div className="relative">
                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo/20 dark:text-vanilla/20" size={18} />
                    <input
                      name="fullName"
                      defaultValue={user.fullName || ''}
                      required
                      className="w-full bg-transparent border-b-2 border-indigo/10 dark:border-vanilla/10 rounded-none py-4 pl-10 pr-4 text-indigo dark:text-vanilla outline-none focus:border-indigo dark:focus:border-vanilla transition-all font-black text-xl placeholder:opacity-20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Email' : 'Email Address'}</label>
                  <div className="relative">
                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo/20 dark:text-vanilla/20" size={18} />
                    <input
                      name="email"
                      type="email"
                      defaultValue={user.email}
                      required
                      className="w-full bg-transparent border-b-2 border-indigo/10 dark:border-vanilla/10 rounded-none py-4 pl-10 pr-4 text-indigo dark:text-vanilla outline-none focus:border-indigo dark:focus:border-vanilla transition-all font-black text-xl placeholder:opacity-20"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="modern-btn !px-10 py-5 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {language === 'id' ? 'Simpan Profil' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Password Info */}
          <div className="modern-card">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-indigo/5 dark:border-vanilla/5">
              <div className="p-3 bg-rose-500/5 rounded-xl text-rose-500">
                <Lock size={18} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo/40 dark:text-vanilla/40">
                {language === 'id' ? 'Ubah Kata Sandi' : 'Change Password'}
              </h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Kata Sandi Lama' : 'Current Password'}</label>
                  <input
                    name="currentPassword"
                    type="password"
                    required
                    className="w-full bg-indigo/5 dark:bg-vanilla/5 border border-indigo/10 dark:border-vanilla/10 text-indigo dark:text-vanilla rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo dark:focus:border-vanilla transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-indigo/40 dark:text-vanilla/40 uppercase tracking-widest ml-1">{language === 'id' ? 'Kata Sandi Baru' : 'New Password'}</label>
                  <input
                    name="newPassword"
                    type="password"
                    required
                    className="w-full bg-indigo/5 dark:bg-vanilla/5 border border-indigo/10 dark:border-vanilla/10 text-indigo dark:text-vanilla rounded-2xl p-4 text-xs font-bold outline-none focus:border-indigo dark:focus:border-vanilla transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="modern-btn !bg-indigo-muted !text-vanilla dark:!bg-vanilla dark:!text-indigo !px-10 py-5 active:scale-95 disabled:opacity-50"
              >
                {pwLoading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                {language === 'id' ? 'Perbarui Sandi' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
